import {
  Controller,
  UseGuards,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  Body,
  Post,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGateway } from './auth.gateway';
import { EventsMock } from './utils/event-mock';
import { AuthGuard } from 'src/common/guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authGateway: AuthGateway,
  ) {}

  @Post('login')
  async login(@Body() body) {
    return { accessToken: body.message };
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout() {
    return { success: true };
  }

  @Post('authenticated')
  async qrClickAuth(@Req() req, @Body() body, @Res() res) {
    const EVENT_NAME = 'authenticated';

    Logger.debug(body);

    const authToken = await this.authService.authenticateUser(body);

    if (authToken)
      this.authGateway.sendMessageByNonce(
        body.nonce,
        EVENT_NAME,
        authToken.access_token,
      );

    res.status(200).send({
      success: authToken ? true : false,
    });
  }

  @Post('scanning')
  async qrScanAuth(@Req() req, @Body() body, @Res() res) {
    const EVENT_NAME = 'auth_scan';
    await this.authGateway.sendMessageByNonce(
      body.nonce,
      EVENT_NAME,
      EventsMock[EVENT_NAME],
    );
    res.status(200).send({
      button_text: 'Confirm Access',
      explanation_text: 'Origina Token',
    });
  }
}
