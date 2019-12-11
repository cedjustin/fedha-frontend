import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import * as moment from 'moment';

@Component({
  selector: 'app-home-blog',
  templateUrl: './home-blog.component.html',
  styleUrls: ['./home-blog.component.scss']
})
export class HomeBlogComponent implements OnInit {

  // variable creation
  loadingProducts = 0;
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
  loadingData = 0;
  connection: any = {
    error: 0,
    message: ''
  };
  dataLoaded = 0;
  blogData: any;
  offSet = 0;
  currentBlog: any = {
    linktoimage: null,
    title: null,
    content: null
  };
  onSaleDays: number = null;
  noPosts = false;
  onSaleDataLoaded = 0;

  constructor(private http: HttpService) { }

  // get blog content
  _getBlogContent() {
    this.dataLoaded = 0;
    this.connection = {
      error: 0,
      message: 'Connection problem, check your internet and refresh the page'
    };
    this.loadingData = 1;
    this.http._getBlog(this.offSet).subscribe(
      res => {
        this.loadingData = 0;
        this.blogData = res.response.data;
        this.blogData.forEach(element => {
          element.comments = JSON.parse(element.comments);
          element.commentsSize = element.comments.length;
        });
        this.dataLoaded = 1;
      },
      err => {
        this.loadingData = 0;
        this.dataLoaded = 0;
        this.connection = {
          error: 1,
          message: 'Connection problem, check your internet and refresh the page'
        };
      }
    );
  }

  // get date alone
  _getDay(time: any) {
    return moment(time).format('DD');
  }

  // get month and year alone
  _getMonthNYear(time: any) {
    return moment(time).format('MMM, YYYY');
  }

  // get the selected blog
  _getCurrentBlog(blog: object) {
    this.currentBlog = blog;
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

  // get products on sale
  _getPosts(sortby: any, offset: any, order: any) {
    this.loadingProducts = 1;
    this.http._getAllPostsOnDiscount(sortby, offset, order).subscribe(
      res => {
        if (res.response.error === 1 && res.response.message === 'you have no posts on sale') {
          this.loadingProducts = 0;
          this.noPosts = true;
          this.posts = [];
        } else {
          this.posts = res.response.data;
          this.posts.forEach(post => {
            post.linktoimage = JSON.parse(post.linktoimage);
          });
          this._checkIfSaleExp();
          this.onSaleDataLoaded = 1;
          this.loadingProducts = 0;
        }
      },
      err => {
        this.loadingProducts = 0;
      });
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

  ngOnInit() {
    this._getBlogContent();
    this._getPosts(this.sortBy, JSON.stringify(this.offset), this.order);
  }

}
