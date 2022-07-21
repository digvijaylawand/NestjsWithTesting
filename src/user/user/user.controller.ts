import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { EditUser } from '../../dto/edit-user.dto';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { JwtGuard } from '../../auth/guard';
import { UserService } from './user.service';


@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('me')
    getMe(@GetUser() user:User) {
        console.log(user);
        return user;
    }

    @Patch()
    editUser(@GetUser('id') userId: number,@Body() dto: EditUser,) 
    {
        return this.userService.editUser(userId, dto);
    }
}
