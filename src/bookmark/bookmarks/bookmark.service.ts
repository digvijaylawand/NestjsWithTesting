import { ForbiddenException, Injectable } from '@nestjs/common';
import { EditBookmarkDto } from '../../dto/edit-bookmark.dto';
import { CreateBookmarkDto } from '../../dto/bookmark.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BookmarkService {
    constructor(private prisma:PrismaService){}
   async getBookmarks(user) {
        const bookmark = await this.prisma.bookmark.findMany({
            where: {
                userId: user.id,
            }
        });
        return bookmark;
    }

    getBookmarkById(userId:number,bookmarkId:number) {}

   async createBookmark(user,dto:CreateBookmarkDto) {
        let userId:number = parseInt(user.id);
        const bookmark= await this.prisma.bookmark.create({
            data: {
                userId:userId,
                ...dto
            }
        });
        return bookmark;
    }

    async editBookmarkById(user,bookmarkId:number,dto:EditBookmarkDto) {
        const bookmark =
      await this.prisma.bookmark.findUnique({
        where: {
          id: bookmarkId,
        },
      });

    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== user.id)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
    }

    async deleteBookmarkById(user,bookmarkId:number) {
        const bookmark =
      await this.prisma.bookmark.findUnique({
        where: {
          id: bookmarkId,
        },
      });

    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== user.id)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
    }
}
