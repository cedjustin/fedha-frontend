import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  // variables
  showSearch = false;
  showFilter = false;
  posts: any = [];
  postsData: any = [];
  allcolors: any = [];
  offset = 0;
  order = 'DESC';
  sortBy = 'datecreated';
  loadingMore = 0;
  tab = 'all';

  constructor(private http: HttpService, private router: Router) { }
  phoneNumber = '(+12) 222 3456 888';

  changeShowSearch() {
    this.showSearch = !this.showSearch;
    this.showFilter = false;
  }

  changeFilterSearch() {
    this.showSearch = false;
    this.showFilter = !this.showFilter;
  }

  // a function to get all posts
  _getPosts(sortby: any, offset: any, order: any) {
    this.http._getAllPosts(sortby, offset, order).subscribe(
      res => {
        if (res.response.error === 1 && res.response.message === 'you have no posts') {
          this.posts = [];
        } else {
          this.posts = res.response.data;
          // restructuring the posts array
          this.posts.forEach(post => {
            post.linktoimage = JSON.parse(post.linktoimage);
            post.sizes = JSON.parse(post.sizes);
            // getting colorinfo
            post.linktoimage.forEach(element => {
              element.colorinfo = this.allcolors.find(color => {
                return color.id == JSON.parse(element.colorid);
              });
            });
          });
          this._checkIfSaleExp();
        }
      },
      err => {
        console.log(err);
      }
    );
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
        // console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  // a function to get colors
  _getColors() {
    this.http._getColors().subscribe(
      res => {
        if (res.response.error === 1 && res.response.message === 'you have no colors in db') {
          this.router.navigate(['/admin/dashboard/gender']);
        } else {
          this.allcolors = res.response.data;
        }
      },
      err => {
        console.log(err);
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

  // on page change
  _onLoadMore() {
    if (this.loadingMore === 3 || this.loadingMore === 1) { } else {
      this.loadingMore = 1;
      const newOffset = this.offset + 10;
      this.offset = newOffset;
      this.http._getAllPosts(this.sortBy, JSON.stringify(newOffset), this.order).subscribe(
        res => {
          if (res.response.error === 1 && res.response.message === 'you have no posts') {
            this.loadingMore = 3;
          } else {
            this.loadingMore = 0;
            // restructuring the posts array
            res.response.data.forEach(post => {
              this.posts = [...this.posts, post];
              post.linktoimage = JSON.parse(post.linktoimage);
              post.sizes = JSON.parse(post.sizes);
              // getting colorinfo
              post.linktoimage.forEach(element => {
                element.colorinfo = this.allcolors.find(color => {
                  return color.id == JSON.parse(element.colorid);
                });
              });
            });
            this._checkIfSaleExp();
          }
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  // when a tab is changeds

  ngOnInit() {
    this._getColors();
    this._getPosts(this.sortBy, JSON.stringify(this.offset), this.order);
  }

}
