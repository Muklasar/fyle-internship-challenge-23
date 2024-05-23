import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  username: string = 'muklasar';
  repositories: any[] = [];
  user: any = {};
  error: boolean = false;
  page: number = 1;
  perPage: number = 10;
  pageSizeOptions: number[] = [10, 20, 50, 100];
  isLoading: boolean = true;
  totalItems: number = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.searchAll();
  }
  async searchAll() {
    this.isLoading = true;
    await this.searchUser();
    await this.getUserRepos();
    this.isLoading = false;
  }
  async searchUser() {
    return new Promise<void>((resolve, reject) => {
      this.apiService.getUser(this.username).subscribe(
        (data: any) => {
          if (data) {
            this.user = data;
            this.error = false;
          } else {
            this.user = {};
            this.error = true;
          }
          resolve();
        },
        () => {
          this.user = {};
          this.error = true;
          resolve();
        }
      );
    });
  }
  async getUserRepos() {
    return new Promise<void>((resolve, reject) => {
      if (this.username) {
        this.apiService
          .getUserRepos(this.username, this.page, this.perPage)
          .subscribe(
            (data: any[]) => {
              this.repositories = data;
              this.error = data.length === 0;
              resolve();
            },
            () => {
              this.repositories = [];
              this.error = true;
              resolve();
            }
          );
      } else {
        resolve();
      }
    });
  }
  onUsernameChange(event: any) {
    this.username = event.target.value;
    console.log(this.repositories);
    console.log(this.user);
  }
  onPageChange(page: number) {
    this.page = page;
    this.searchAll();
  }
  getPages(): number[] {
    const pageCount = Math.ceil(this.user.public_repos / this.perPage);
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }
  pageIncrement() {
    if (this.page <(this.user.public_repos / this.perPage)) {
      this.page = this.page + 1;
      this.searchAll();
    }
  }
  pageDecrement() {
    if (this.page != 1) {
      this.page = this.page - 1;
      this.searchAll();
    }
  }
  setPerPage(value:number){
    this.perPage = value
    this.searchAll()
  }
}
