import {
  inject,
  beforeEachProviders,
  beforeEach,
  afterEach,
  expect,
  describe,
  ddescribe,
  it,
  xit,
  iit,
} from 'angular2/testing';
import {
  Headers,
  ResponseOptions,
  Response,
  BaseResponseOptions,
  RequestMethod,
} from 'angular2/http';
import {MockBackend} from 'angular2/http/testing';

import {APP_TEST_PROVIDERS} from "app/providers";
import {UserService} from "app/services";
import {UserParams} from "app/interfaces";

const dummyListJson = {
  content: [
    {
      id: 1,
      content: 'content1',
      createdAt: 0,
      user: {
        id: 1,
        email: 'test1@test.com',
        name: 'test user1'
      },
    },
    {
      id: 2,
      content: 'content2',
      createdAt: 1234567,
      user: {
        id: 1,
        email: 'test1@test.com',
        name: 'test user1'
      },
    },
  ],
  totalPages: 1,
  totalElements: 2,
};

const dummyGetJson = {
  user: {
    id: 1,
    email: 'test1@test.com',
    name: 'test1',
  },
  userStats: {
    micropostCnt: 1,
    followingCnt: 2,
    followerCnt: 3,
  },
};

export function main() {
  describe('UserService', () => {

    var userService:UserService;
    var backend:MockBackend;

    beforeEachProviders(() => [APP_TEST_PROVIDERS]);
    beforeEach(inject([UserService, MockBackend], (..._) => {
      [userService, backend] = _;
    }));
    afterEach(() => localStorage.clear());

    describe('.list', () => {
      it("list users", (done) => {
        backend.connections.subscribe(conn => {
          conn.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(dummyListJson),
          })));
          expect(conn.request.method).toEqual(RequestMethod.Get);
          expect(conn.request.url).toEqual('/api/users?page=1&size=5');
        });
        userService.list().subscribe(res => {
          expect(res).toEqual(dummyListJson);
          done();
        });
      });
    }); // .list

    describe('.get', () => {
      it("get user", (done) => {
        backend.connections.subscribe(conn => {
          conn.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(dummyGetJson),
          })));
          expect(conn.request.method).toEqual(RequestMethod.Get);
          expect(conn.request.url).toEqual('/api/users/1');
        });
        userService.get(1).subscribe(res => {
          expect(res).toEqual(dummyGetJson);
          done();
        });
      });
    }); // .get

    describe('.create', () => {
      it("create user", (done) => {
        const params:UserParams = {
          email: 'test1@test.com',
          password: 'secret',
          name: 'test1',
        };
        backend.connections.subscribe(conn => {
          conn.mockRespond(new Response(new BaseResponseOptions()));
          expect(conn.request.method).toEqual(RequestMethod.Post);
          expect(conn.request.url).toEqual('/api/users');
          expect(conn.request.text()).toEqual(JSON.stringify(params));
        });
        userService.create(params).subscribe(() => {
          done();
        });
      });
    }); // .create

    describe('.updateMe', () => {
      it("update me", (done) => {
        const params:UserParams = {
          email: 'test1@test.com',
          password: 'secret',
          name: 'test1',
        };
        backend.connections.subscribe(conn => {
          conn.mockRespond(new Response(new BaseResponseOptions()));
          expect(conn.request.method).toEqual(RequestMethod.Patch);
          expect(conn.request.url).toEqual('/api/users/me');
          expect(conn.request.text()).toEqual(JSON.stringify(params));
        });
        userService.updateMe(params).subscribe(() => {
          done();
        });
      });
    }); // .updateMe

    describe('.listFollowings', () => {
      it("list followings", (done) => {
        backend.connections.subscribe(conn => {
          conn.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(dummyListJson),
          })));
          expect(conn.request.method).toEqual(RequestMethod.Get);
          expect(conn.request.url).toEqual('/api/users/1/followings?page=1&size=5');
        });
        userService.listFollowings('1').subscribe(res => {
          expect(res).toEqual(dummyListJson);
          done();
        });
      });
    }); // .listFollowings

    describe('.listFollowers', () => {
      it("list followers", (done) => {
        backend.connections.subscribe(conn => {
          conn.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(dummyListJson),
          })));
          expect(conn.request.method).toEqual(RequestMethod.Get);
          expect(conn.request.url).toEqual('/api/users/1/followers?page=1&size=5');
        });
        userService.listFollowers('1').subscribe(res => {
          expect(res).toEqual(dummyListJson);
          done();
        });
      });
    }); // .listFollowers

  });
}