import { Module } from '@nestjs/common';
import { BookmarksController } from './bookmarks/bookmarks.controller';
import { BookmarkService } from './bookmarks/bookmark.service';

@Module({
  controllers: [BookmarksController],
  providers: [BookmarkService]
})
export class BookmarkModule {}
