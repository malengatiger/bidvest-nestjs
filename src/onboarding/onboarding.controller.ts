import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('/addOrganizations')
  addOrganizations(@Body() csvFile: File) {
    return this.onboardingService.addOrganizations(csvFile);
  }
  @Post('/addOrganization')
  async addOrganization(@Body() organization: Organization) {
     try {
       const result =
         await this.onboardingService.addOrganization(organization);
       return result;
     } catch (error) {
       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
     }
  }
  @Post('/addUsers')
  addUsers(@Body() csvFile: File) {
    return this.onboardingService.addUsers(csvFile);
  }
  @Post('/addUser')
  addUser(@Body() user: User) {
    return this.onboardingService.addUser(user);
  }
}
