// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import { MessageHashUtils } from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/// @title FaxChainLetter
/// @notice On-chain Fax Chain Letter protocol. Each chain link is a 1-bit
/// thermal-fax artifact. Forwarding a link within 72 hours earns the holder a
/// send credit; letting the timer expire jams the line and zeros the holder's
/// credits until a recovery action is taken.
///
/// @dev The "forward" call may be submitted by a relayer. The holder signs
/// `keccak256(address(this) || chainId || parentTokenId || recipient || newImageHash)`
/// with Ethereum's signed-message prefix, allowing the app to pay gas while the
/// holder remains in control of the token.
contract FaxChainLetter is ERC721, AccessControl {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    uint256 public constant FADE_DURATION = 72 hours;
    uint256 public constant BASE_CREDITS = 1;
    uint256 public constant START_CREDITS = 2;

    struct Hop {
        uint256 receivedAt;
        string imageHash;
        address sender;
        uint256 parentTokenId;
    }

    /// @notice Hop state keyed by current holder and tokenId.
    mapping(address => mapping(uint256 => Hop)) public activeHops;

    /// @notice Full provenance for every token (even after the hop is cleared).
    mapping(uint256 => Hop) public hopOf;

    /// @notice Send credits per user.
    mapping(address => uint256) public credits;

    /// @notice True once a user has claimed starting credits.
    mapping(address => bool) public initializedCredits;

    uint256 public nextTokenId;

    event Forwarded(
        uint256 indexed parentTokenId,
        uint256 indexed newTokenId,
        address indexed holder,
        address recipient,
        string newImageHash,
        uint256 timestamp
    );

    event JamCleared(
        address indexed user,
        uint256 indexed tokenId,
        bytes32 recoveryHash,
        uint256 timestamp
    );

    event CreditsInitialized(address indexed user, uint256 amount);

    error LineJammed(address user, uint256 tokenId);
    error NotHolder(address holder, uint256 tokenId);
    error InvalidSignature(address holder);
    error NotJammed(address user, uint256 tokenId);
    error AlreadyInitialized(address user);

    constructor(
        string memory name,
        string memory symbol,
        address admin
    ) ERC721(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
        nextTokenId = 1;
    }

    /// @notice Bootstrap a new user's credit balance to 2.
    function initializeCredits(address user) external onlyRole(OPERATOR_ROLE) {
        if (initializedCredits[user]) revert AlreadyInitialized(user);
        credits[user] = START_CREDITS;
        initializedCredits[user] = true;
        emit CreditsInitialized(user, START_CREDITS);
    }

    /// @notice Mint the first link of a chain. The recipient's active hop starts.
    function mint(
        address recipient,
        string calldata imageHash
    ) external onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
        tokenId = nextTokenId++;
        _safeMint(recipient, tokenId);

        Hop memory h = Hop({
            receivedAt: block.timestamp,
            imageHash: imageHash,
            sender: address(0),
            parentTokenId: 0
        });

        hopOf[tokenId] = h;
        activeHops[recipient][tokenId] = h;
    }

    /// @notice Forward an active hop before the 72-hour Thermal Fade expires.
    /// The holder signs the new image hash so the relayer cannot forge links.
    function forward(
        address holder,
        uint256 parentTokenId,
        address recipient,
        string calldata newImageHash,
        bytes calldata signature
    ) external returns (uint256 newTokenId) {
        if (ownerOf(parentTokenId) != holder) revert NotHolder(holder, parentTokenId);

        Hop storage currentHop = activeHops[holder][parentTokenId];
        if (currentHop.receivedAt == 0) revert NotHolder(holder, parentTokenId);
        if (block.timestamp > currentHop.receivedAt + FADE_DURATION) {
            revert LineJammed(holder, parentTokenId);
        }

        bytes32 digest = keccak256(
            abi.encodePacked(
                address(this),
                block.chainid,
                parentTokenId,
                recipient,
                newImageHash
            )
        );
        if (digest.toEthSignedMessageHash().recover(signature) != holder) {
            revert InvalidSignature(holder);
        }

        // Earn a send credit for forwarding within the fade window.
        credits[holder] += 1;

        newTokenId = nextTokenId++;
        _safeMint(recipient, newTokenId);

        Hop memory h = Hop({
            receivedAt: block.timestamp,
            imageHash: newImageHash,
            sender: holder,
            parentTokenId: parentTokenId
        });

        hopOf[newTokenId] = h;
        activeHops[recipient][newTokenId] = h;

        emit Forwarded(
            parentTokenId,
            newTokenId,
            holder,
            recipient,
            newImageHash,
            block.timestamp
        );
    }

    /// @notice Clear a line jam. Sets the user's credits to the base level of 1
    /// and removes the expired hop. Anyone may call (gas on Gnosis is
    /// negligible), but only the user can be credited with the recovery.
    function clearJam(address user, uint256 tokenId) external {
        Hop storage jammedHop = activeHops[user][tokenId];
        if (jammedHop.receivedAt == 0) revert NotHolder(user, tokenId);
        if (block.timestamp <= jammedHop.receivedAt + FADE_DURATION) {
            revert NotJammed(user, tokenId);
        }

        bytes32 recoveryHash = keccak256(
            abi.encodePacked(user, tokenId, block.timestamp, "line-cleared")
        );

        credits[user] = BASE_CREDITS;
        delete activeHops[user][tokenId];

        emit JamCleared(user, tokenId, recoveryHash, block.timestamp);
    }

    /// @notice Convenience view for clients building the Telegraph Log.
    function getHop(uint256 tokenId) external view returns (Hop memory) {
        return hopOf[tokenId];
    }

    /// @notice Check whether a token's fade timer has expired.
    function isJammed(address user, uint256 tokenId) external view returns (bool) {
        Hop storage h = activeHops[user][tokenId];
        if (h.receivedAt == 0) return false;
        return block.timestamp > h.receivedAt + FADE_DURATION;
    }

    /// @notice Time remaining on an active hop, or 0 if expired/missing.
    function timeRemaining(address user, uint256 tokenId) external view returns (uint256) {
        Hop storage h = activeHops[user][tokenId];
        if (h.receivedAt == 0) return 0;
        uint256 deadline = h.receivedAt + FADE_DURATION;
        return block.timestamp >= deadline ? 0 : deadline - block.timestamp;
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
