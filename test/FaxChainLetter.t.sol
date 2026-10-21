// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Test } from "forge-std/Test.sol";
import { MessageHashUtils } from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import { FaxChainLetter } from "../src/FaxChainLetter.sol";

contract FaxChainLetterTest is Test {
    using MessageHashUtils for bytes32;
    FaxChainLetter public chain;
    address public admin = address(0xAD1);
    address public minter = address(0xAD2);
    address public operator = address(0xAD3);
    address public bob = address(0xB0B);
    address public carol = address(0xCA);
    address public alice;
    uint256 public aliceKey;

    function setUp() public {
        (alice, aliceKey) = makeAddrAndKey("alice");
        chain = new FaxChainLetter("FaxChainLetter", "FCL", admin);
        vm.startPrank(admin);
        chain.grantRole(chain.MINTER_ROLE(), minter);
        chain.grantRole(chain.OPERATOR_ROLE(), operator);
        vm.stopPrank();
    }

    function testInitializeCredits() public {
        vm.prank(operator);
        chain.initializeCredits(alice);
        assertEq(chain.credits(alice), 2);
    }

    function testMint() public {
        vm.prank(operator);
        chain.initializeCredits(alice);
        vm.prank(minter);
        uint256 tokenId = chain.mint(alice, "hash1");
        assertEq(chain.ownerOf(tokenId), alice);
        (uint256 receivedAt, string memory imageHash, address sender, uint256 parent) = chain.hopOf(tokenId);
        assertEq(imageHash, "hash1");
        assertEq(parent, 0);
        assertEq(sender, address(0));
        assertEq(receivedAt, block.timestamp);
    }

    function testForwardBeforeFade() public {
        vm.prank(operator);
        chain.initializeCredits(alice);
        vm.prank(minter);
        uint256 parent = chain.mint(alice, "hash1");

        bytes32 digest = keccak256(
            abi.encodePacked(address(chain), block.chainid, parent, carol, "hash2")
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(aliceKey, digest.toEthSignedMessageHash());

        vm.prank(alice);
        uint256 newTokenId = chain.forward(alice, parent, carol, "hash2", abi.encodePacked(r, s, v));
        assertEq(chain.ownerOf(newTokenId), carol);
        assertEq(chain.credits(alice), 3);
    }

    function testForwardAfterFadeReverts() public {
        vm.prank(operator);
        chain.initializeCredits(alice);
        vm.prank(minter);
        uint256 parent = chain.mint(alice, "hash1");

        skip(73 hours);

        bytes32 digest = keccak256(
            abi.encodePacked(address(chain), block.chainid, parent, carol, "hash2")
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(aliceKey, digest.toEthSignedMessageHash());

        vm.expectRevert(abi.encodeWithSelector(FaxChainLetter.LineJammed.selector, alice, parent));
        vm.prank(alice);
        chain.forward(alice, parent, carol, "hash2", abi.encodePacked(r, s, v));
    }

    function testClearJam() public {
        vm.prank(operator);
        chain.initializeCredits(alice);
        vm.prank(minter);
        uint256 parent = chain.mint(alice, "hash1");

        skip(73 hours);
        chain.clearJam(alice, parent);
        assertEq(chain.credits(alice), 1);
    }
}
