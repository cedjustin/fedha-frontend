import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-dash-post',
  templateUrl: './dash-post.component.html',
  styleUrls: ['./dash-post.component.scss']
})
export class DashPostComponent implements OnInit {

  // variable creation
  pages = [];
  offset = 0;
  order = 'ASC';
  sortBy = 'datecreated';
  posts: any;
  currentPage = 1;
  loadingProducts = 1;




  constructor(private http: HttpService) { }

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
      err => { console.log(err); }
    );
  }

  // get all posts
  _getPosts(sortby: any, offset: any, order: any) {
    this.loadingProducts = 1;
    this.http._getAllPosts(sortby, offset, order).subscribe(
      res => {
        this.posts = res.response.data;
        this.posts.forEach(post => {
          post.rate = JSON.parse(post.rate);
        });
        this.loadingProducts = 0;
      },
      err => {
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
  _onSortChange(status) {
    if (status === 'date descending') {
      this.order = 'DESC';
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
      this.order = 'ASC';
      this.sortBy = 'datecreated';
      this._getPosts(this.sortBy, JSON.stringify(this.offset), this.order);
    }
  }

  // classes functions

  ngOnInit() {
    this._getPages();
    this._getPosts(this.sortBy, JSON.stringify(this.offset), this.order);
  }

}
