import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from './services/api.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: ApiService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AppComponent],
      providers: [ApiService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('#onPageChange', () => {
    it('should update page and call searchAll', () => {
      spyOn(component, 'searchAll');
      component.onPageChange(2);
      expect(component.page).toBe(2);
      expect(component.searchAll).toHaveBeenCalled();
    });
  });

  describe('#getPages', () => {
    it('should return an array of pages based on user public_repos', () => {
      component.user.public_repos = 35;
      component.perPage = 10;

      const pages = component.getPages();
      expect(pages).toEqual([1, 2, 3, 4]);
    });
  });

  describe('#pageIncrement', () => {
    it('should not increment the page if already at max', () => {
      component.user.public_repos = 20;
      component.perPage = 10;
      component.page = 2;
      spyOn(component, 'searchAll');

      component.pageIncrement();
      expect(component.page).toBe(2);
      expect(component.searchAll).not.toHaveBeenCalled();
    });

    it('should increment the page and call searchAll', () => {
      component.user.public_repos = 30;
      component.perPage = 10;
      component.page = 2;
      spyOn(component, 'searchAll');

      component.pageIncrement();
      expect(component.page).toBe(3);
      expect(component.searchAll).toHaveBeenCalled();
    });
  });

  describe('#pageDecrement', () => {
    it('should not decrement the page if already at 1', () => {
      component.page = 1;
      spyOn(component, 'searchAll');

      component.pageDecrement();
      expect(component.page).toBe(1);
      expect(component.searchAll).not.toHaveBeenCalled();
    });

    it('should decrement the page and call searchAll', () => {
      component.page = 2;
      spyOn(component, 'searchAll');

      component.pageDecrement();
      expect(component.page).toBe(1);
      expect(component.searchAll).toHaveBeenCalled();
    });
  });
});
