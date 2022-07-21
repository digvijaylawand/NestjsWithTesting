import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as argon2 from "argon2";
import { AuthDto } from "../dto/auth.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable({

})
export class AuthService {
    constructor(public prisma:PrismaService,private jwt:JwtService,private config:ConfigService) { }

    async signUp(dto:AuthDto){
        const hash= await argon2.hash(dto.password)
        try {
        const user = await this.prisma.user.create({
            data:{
                email:dto.email,
                hash,
            },
            select:{
                id:true,
                email:true,
                createdAt:true,
            }
        })
        return this.signJWT(user.id,user.email);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError){
                if(error.code == 'P2002'){
                    throw new ForbiddenException("Email already exists");
                }
            } 
            throw error;
        }
    }
   async signIn(dto:AuthDto){
        const user = await this.prisma.user.findUnique({
            where:{
                email:dto.email,
            },
        })
        //if Email does not match
        if(!user) throw new ForbiddenException("Email is incorrect");
        
        //check password using argon
        const valid = await argon2.verify(user.hash, dto.password);

        //if Password does not match
        if(!valid) throw new ForbiddenException("Password is incorrect");

        delete user.hash

        return this.signJWT(user.id,user.email);
    }

    async signJWT(userId:number,email:string){
        const payload = {
            sub:userId,
            email,
        }
        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(
            payload,
            {
              expiresIn: '15m',
              secret: secret,
            },
          );
      
          return {
            access_token: token,
          };
    }
}