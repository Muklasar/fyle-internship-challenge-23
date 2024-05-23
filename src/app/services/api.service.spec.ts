import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getUser', () => {
    it('should return expected user data', () => {
      const mockUser = { login: 'testuser', id: 1, name: 'Test User' };
      const githubUsername = 'testuser';

      service.getUser(githubUsername).subscribe((data) => {
        expect(data).toEqual(mockUser);
      });

      const req = httpTestingController.expectOne(`https://api.github.com/users/${githubUsername}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should return an error when the server returns a 404', () => {
      const githubUsername = 'nonexistentuser';
      const errorMessage = 'User not found';

      service.getUser(githubUsername).subscribe(
        () => fail('expected an error, not user data'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
          expect(error.error).toContain(errorMessage);
        }
      );

      const req = httpTestingController.expectOne(`https://api.github.com/users/${githubUsername}`);
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('#getUserRepos', () => {
    it('should return expected repositories data', () => {
      const mockRepos = [
        { id: 1, name: 'Repo 1' },
        { id: 2, name: 'Repo 2' }
      ];
      const username = 'testuser';
      const page = 1;
      const perPage = 10;

      service.getUserRepos(username, page, perPage).subscribe((data) => {
        expect(data).toEqual(mockRepos);
      });

      const req = httpTestingController.expectOne(
        `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockRepos);
    });

    it('should return an error when the server returns a 404', () => {
      const username = 'nonexistentuser';
      const page = 1;
      const perPage = 10;
      const errorMessage = 'Repos not found';

      service.getUserRepos(username, page, perPage).subscribe(
        () => fail('expected an error, not repos data'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
          expect(error.error).toContain(errorMessage);
        }
      );

      const req = httpTestingController.expectOne(
        `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`
      );
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });
});
