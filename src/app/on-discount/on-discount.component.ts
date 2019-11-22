import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-on-discount',
  templateUrl: './on-discount.component.html',
  styleUrls: ['./on-discount.component.scss']
})
export class OnDiscountComponent implements OnInit {

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
    id: null,
    description: null,
    instock: null,
    amount: null,
    rate: null,
    linktoimage: null,
  };
  onSaleDays: number = null;
  noPosts = false;

  constructor(private http: HttpService, private router: Router) { }

  // get pagination numbers
  _getPages() {
    let i: number;
    this.http._getDiscountedProductsCount().subscribe(
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
    this.http._getAllPostsOnDiscount(sortby, offset, order).subscribe(
      res => {
        if (res.error === 1 && res.message === 'you are lost') {
          localStorage.removeItem('token');
          localStorage.removeItem('userinfo');
          this.router.navigate(['/admin']);
        } else if (res.response.error === 1 && res.response.message === 'you have no posts on sale') {
          this.loadingProducts = 0;
          this.noPosts = true;
          this.posts = [];
        } else {
          this.posts = res.response.data;
          this.posts.forEach(post => {
            post.rate = JSON.parse(post.rate);
          });
          this._checkIfSaleExp();
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

  // get current post
  _getCurrentPost(post: any) {
    this.currentPost = post;
  }

  // get time remaining from end of sale
  _getMoment(time: any) {
    const start = moment().format();
    const end = moment(JSON.parse(time));
    return end.from(start);
  }

  // a function to check and reshape data if its not still on sale
  _checkIfSaleExp() {
    this.posts.forEach(post => {
      if (post.onsale === '1') {
        const start = moment().format();
        const end = moment(JSON.parse(post.saleexp));
        if (!end.isAfter(start) === true) {
          this._removeFromSale(post);
          post.onsale = 0;
          post.saleexp = 0;
        } else { }
      } else { }
    });
  }

  // a function to make expired sale not onsale
  _removeFromSale(post: object) {
    const data: object = {
      postid: null
    };
    // @ts-ignore
    data.postid = post.id;
    this.http._putPostFromSale(data).subscribe(
      res => {
      },
      err => {
      }
    );
  }

  // a function to get discount
  _discountedPrice(post: any) {
    const oldPrice = post.amount;
    const percentage = post.discountexp;
    let response;
    let newPrice: number;
    newPrice = (oldPrice * percentage) / 100;
    response = oldPrice - newPrice;
    return response;
  }

  // a function to remove products from being on sale
  // tslint:disable-next-line: variable-name
  _changeDiscount(post: object) {
    this.http._updPost(post).subscribe(
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


  ngOnInit() {
    this._getPages();
    this._getPosts(this.sortBy, JSON.stringify(this.offset), this.order);
  }
}
