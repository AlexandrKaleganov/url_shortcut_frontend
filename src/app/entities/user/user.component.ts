import {Component, OnInit} from '@angular/core';
import {User} from '../../shared/models/user.model';
import {UserService} from './user.service';
import {HttpParams} from '@angular/common/http';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateUserComponent} from './create-user/create-user.component';
import {FilterUserComponent} from './filter-user/filter-user.component';
import {AuthService} from '../../core/auth/auth.service';
import {Role} from '../../shared/models/role.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userList: User[];
  usersService: UserService;
  totalItems: number;
  itemsPerPage = 20;
  page = 1;
  loginFilter: string;
  domainFilter: string;
  firstNameFilter: string;
  currentRoles: Role[];

  constructor(usersService: UserService, public modalService: NgbModal, public authService: AuthService) {
    this.usersService = usersService;
  }

  ngOnInit() {
    this.authService.getAuthority().subscribe(res => {
      this.currentRoles = res.body;
      this.loadPage();
    });
  }

  loadPage(page?: number) {
    const pageToLoad: number = page ? page : this.page;
    console.log(pageToLoad);
    let options: HttpParams = new HttpParams();
    if (pageToLoad !== undefined) {
      options = options.set('page', (pageToLoad - 1).toString());
    }
    options = options.set('size', this.itemsPerPage.toString());
    options = options.set('sort', 'id');
    if (this.loginFilter) {
      options = options.set('login', this.loginFilter);
    }
    if (this.domainFilter) {
      options = options.set('domain', this.domainFilter);
    }
    if (this.firstNameFilter) {
      options = options.set('firstName', this.firstNameFilter);
    }
    this.usersService.findAll(options).subscribe(res => {
      this.userList = res.body.content;
      this.totalItems = res.body.totalElements;
      console.warn(this.totalItems);
    });
  }

  addNewUser() {
    const modelRef = this.modalService.open(CreateUserComponent, {size: 'lg', backdrop: 'static'});
    modelRef.componentInstance.currentRoles = this.currentRoles;
    modelRef.result.then(res=> {
      if (res) {
        this.loadPage(1);
      }
    });
  }

  delete(user: User): void {
    console.log(user);
  }

  edit(user: User) {
    const modelRef = this.modalService.open(CreateUserComponent, {size: 'lg', backdrop: 'static'});
    modelRef.componentInstance.users = user;
    modelRef.componentInstance.currentRoles = this.currentRoles;
    modelRef.componentInstance.init();
    modelRef.result.then(res=> {
      if (res) {
        this.loadPage(1);
      }
    });
  }

  showFilter() {
    const modelRef = this.modalService.open(FilterUserComponent, {size: 'lg', backdrop: 'static'});
    modelRef.componentInstance.loginFilter = this.loginFilter;
    modelRef.componentInstance.domainFilter = this.domainFilter;
    modelRef.componentInstance.firstNameFilter = this.firstNameFilter;
    modelRef.result.then(result => {
      console.log(result);
      if (result) {
        this.loginFilter = result.loginFilter;
        this.firstNameFilter = result.firstNameFilter;
        this.domainFilter = result.domainFilter;
        this.loadPage(1);
      }
    });
  }

  deleteFilters() {
    this.loginFilter = null;
    this.firstNameFilter = null;
    this.domainFilter = null;
    this.loadPage(1);
  }

  isVisible(user: User) {
    if (this.authService.getCurrentLogin() === user.login) {
      return true;
    } else {
      return this.authService.isHasAnyAuthority(this.currentRoles, ['ADMIN']);
    }
  }
}
