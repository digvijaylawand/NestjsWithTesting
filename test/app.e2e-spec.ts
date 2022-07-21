import { AppModule } from "../src/app.module";
import { Test } from "@nestjs/testing"
import * as pactum from 'pactum';
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import { AuthDto } from "../src/dto/auth.dto";
import { EditUser } from "../src/dto/edit-user.dto";
import { CreateBookmarkDto } from "../src/dto/bookmark.dto";
import { EditBookmarkDto } from "../src/dto/edit-bookmark.dto";
describe('App e2e',() => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({whitelist:true}))
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    prisma.cleanDb();
    pactum.request.setBaseUrl(
      'http://localhost:3333',
    );
  });

  afterAll(() => {
    app.close();
  })

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'qwerty@gmail.com',
      password: '123',
    };
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(201)
          .stores('userAt', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/user/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto : EditUser | any = {
          firstName: 'Vladimir',
          email: 'vlad@codewithvlad.com'
        };
        return pactum
          .spec()
          .patch('/user')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email)
          .inspect();
      });
    });
    describe('Bookmarks', () => {
     describe('Get bookmarks', () => {
        it('should get bookmarks', () => {
          return pactum
            .spec()
            .get('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .stores('bookmarksId', 'id')
            .inspect();
        });
      });

      describe('Create bookmarks', () => {
        const dto: CreateBookmarkDto = {
          title: 'Test',
          discription: 'Test',
          url: 'https://test.com',
        } 
        it('should Create bookmarks', () => {
          return pactum
            .spec()
            .post('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .withBody(dto)
            .expectStatus(201)
            .stores('bookmarksId', 'id')
            .inspect();
        });
      });
      describe('Get bookmarks by Id', () => {
        it('should get bookmarks by Id', () => {
          return pactum
            .spec()
            .get('/bookmarks/{id}')
            .withPathParams('id','$S{bookmarksId}')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .inspect();
        });
      });

      describe('Edit bookmarks by Id', () => {
        const dto: EditBookmarkDto = {
          title: 'Test123',
          url: 'https://test123.com',
        }
        it('should get bookmarks by Id', () => {
          return pactum
            .spec()
            .patch('/bookmarks/{id}')
            .withPathParams('id','$S{bookmarksId}')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .withBody(dto)
            .expectStatus(200)
            .expectBodyContains(dto.title)
            .inspect();
        });
      });
      describe('Delete bookmarks by Id', () => {
        const dto: EditBookmarkDto = {
          title: 'Test123',
          url: 'https://test123.com',
        }
        it('should delete bookmarks by Id', () => {
          return pactum
            .spec()
            .delete('/bookmarks/{id}')
            .withPathParams('id','$S{bookmarksId}')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(204)
            .inspect();
        });
        it('should get empty bookmarks', () => {
          return pactum
            .spec()
            .get('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectJsonLength(0)
            .inspect();
        });
      });
    });
  });

})
