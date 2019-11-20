import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dash-post',
  templateUrl: './dash-post.component.html',
  styleUrls: ['./dash-post.component.scss']
})
export class DashPostComponent implements OnInit {

  // variable creation
  pages = [];
  offset = 0;
  order = 'DESC';
  sortBy = 'datecreated';
  posts: any;
  post: object = {
    description: null,
    linktoimage: null,
    amount: null,
    instock: null,
    rate: null,
    discount: null,
    genderid: null,
    categoryid: null
  };
  currentPage = 1;
  loadingProducts = 1;
  connection = {
    error: 0,
    message: 'Connection is down'
  };
  categories: any;
  genders: any;
  currentPost: object = {
    description: null,
    instock: null,
    amount: null,
    rate: null,
    linktoimage: null
  };




  constructor(private http: HttpService, private router: Router) { }

  // get pagination numbers
  _getPages() {
    let i: number;
    this.http._getAllProductsCount().subscribe(
      resp => {
        const count = resp.response.data[0].count;
        const pages = count / 10;
        const pageToString = JSON.stringify(pages);
        if (pageToString.length < 3) {
          this.pages = Array(i).fill(0).map((x, a) => ({ id: (a + 1), name: `Item ${a + 1}` }));
        } else {
          const currentPage = JSON.parse(pageToString.slice(0, 1));
          i = currentPage + 1;
          this.pages = Array(i).fill(0).map((x, a) => ({ id: (a + 1), name: `Item ${a + 1}` }));
        }
      },
      err => {
        this.loadingProducts = 0;
        this.connection = {
          error: 1,
          message: 'Connection problem, check your internet and refresh the page'
        };
      }
    );
  }

  // get all posts
  _getPosts(sortby: any, offset: any, order: any) {
    this.loadingProducts = 1;
    this.http._getAllPosts(sortby, offset, order).subscribe(
      res => {
        if (res.error === 1 && res.message === 'you are lost') {
          localStorage.removeItem('token');
          localStorage.removeItem('userinfo');
          this.router.navigate(['/admin']);
        } else {
          this.posts = res.response.data;
          this.posts.forEach(post => {
            post.rate = JSON.parse(post.rate);
          });
          this.loadingProducts = 0;
        }
      },
      err => {
        this.loadingProducts = 0;
        this.connection = {
          error: 1,
          message: 'Connection problem, check your internet and refresh the page'
        };
        console.log(err);
      }
    );
  }

  // on page change
  _onPageChange(page: number) {
    this.currentPage = page;
    const newOffset = (page - 1) * 10;
    if (this.offset === newOffset) {
      console.log('same page');
    } else {
      this.posts = [];
      this.offset = newOffset;
      this._getPosts(this.sortBy, JSON.stringify(this.offset), this.order);
    }
  }

  // on sort Page
  _onSortChange(status: any) {
    if (status === 'date descending') {
      this.order = 'ASC';
      this._getPosts(this.sortBy, JSON.stringify(this.offset), this.order);
    } else if (status === 'amount high to low') {
      this.sortBy = 'amount';
      this.order = 'ASC';
      this._getPosts(this.sortBy, JSON.stringify(this.offset), this.order);
    } else if (status === 'amount low to high') {
      this.sortBy = 'amount';
      this.order = 'DESC';
      this._getPosts(this.sortBy, JSON.stringify(this.offset), this.order);
    } else {
      this.order = 'DESC';
      this.sortBy = 'datecreated';
      this._getPosts(this.sortBy, JSON.stringify(this.offset), this.order);
    }
  }

  // a function to get genders
  _getGender() {
    this.loadingProducts = 1;
    this.http._getGender().subscribe(
      res => {
        if (res.response.error === 1 && res.response.message === 'you have no gender in db') {
          this.loadingProducts = 0;
          this.router.navigate(['/admin/dashboard/gender']);
        } else {
          this.loadingProducts = 0;
          this.genders = res.response.data;
        }
      },
      err => {
        this.loadingProducts = 0;
        this.connection = {
          error: 1,
          message: 'Connection problem, check your internet and refresh the page'
        };
        console.log(err);
      }
    );
  }

  // a function to get categories
  _getCategory() {
    this.loadingProducts = 1;
    this.http._getCategory().subscribe(
      res => {
        if (res.response.error === 1 && res.response.message === 'you have no categories in db') {
          this.loadingProducts = 0;
          this.router.navigate(['/admin/dashboard/gender']);
        } else {
          this.loadingProducts = 0;
          this.categories = res.response.data;
        }
      },
      err => {
        this.loadingProducts = 0;
        this.connection = {
          error: 1,
          message: 'Connection problem, check your internet and refresh the page'
        };
        console.log(err);
      }
    );
  }

  // a function to add a post
  _addPost() {
    this.http._addPost(this.post).subscribe(
      res => {
        if (res.response.error === 0) {
          this._getPosts(this.sortBy, JSON.stringify(this.offset), this.order);
        } else {
          console.log(res.response);
        }
      },
      err => {

      }
    );
  }


  // a function to delet post
  _delPost(postid: any) {
    this.http._delPost(postid).subscribe(
      res => {
        if (res.response.error === 0) {
          this._getPosts(this.sortBy, JSON.stringify(this.offset), this.order);
        } else {

        }
      },
      err => {
        console.log(err);
      }
    );
  }

  // get current post
  _getCurrentPost(post: any) {
    this.currentPost = post;
    console.log(post.id);
  }

  ngOnInit() {
    this._getPages();
    this._getPosts(this.sortBy, JSON.stringify(this.offset), this.order);
    this._getGender();
    this._getCategory();
  }

}
