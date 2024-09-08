import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { NFTStorage, File } from 'nft.storage';
import { readFileSync } from 'fs';
import { ethers } from 'ethers';

@Controller('user')
export class UserController {
  @UseGuards(AuthGuard)
  @Get('/me')
  me(@Req() req) {
    return req.user;
  }

  @Post('/create-nft')
  async createNFT() {
    // Simulate to create a NFT with IPFS - TODO: Use a chainlink oracle to create a dNFT (decentralized NFT)
    const provider = new ethers.JsonRpcProvider(
      'https://smart.zeniq.network:9545',
    );

    const signer = new ethers.Wallet(
      '95de03574bafca3af779ddb14cd132d1a2eea6d2c1ac994ac9a1ca4802c8e0f4',
      provider,
    );

    const abi = ['function claimSeat1(uint guess) external'];
    const Contract = new ethers.Contract(
      '0x300fCf01bA495fDA5264d37772306D54fd00CF3A',
      abi,
      signer,
    );

    await Contract.claimSeat1(19);
  }
}
