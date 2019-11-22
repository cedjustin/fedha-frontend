import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import Sweetalert from 'angular-sweetalert';

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
  post: any = {
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
  emptyFields = {
    error: false,
    message: null
  };
  allcolors: any;
  colors: any = [
    {
      id: null,
      pictures: [
        {
          linktoimage: null
        }
      ]
    }
  ];




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
        } else if (res.response.error === 1 && res.response.message === 'you have no posts') {
          this.loadingProducts = 0;
          this.noPosts = true;
        } else {
          this.posts = res.response.data;
          this.posts.forEach(post => {
            post.rate = JSON.parse(post.rate);
            const parsedImageLink = JSON.parse(post.linktoimage);
            post.newImageLink = parsedImageLink.colors[0].pictures[0].linktoimage;
          });
          console.log(res.response.data);
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

  // a function to get genders
  _getColors() {
    this.loadingProducts = 1;
    this.http._getColors().subscribe(
      res => {
        if (res.response.error === 1 && res.response.message === 'you have no colors in db') {
          this.loadingProducts = 0;
          this.router.navigate(['/admin/dashboard/gender']);
        } else {
          this.loadingProducts = 0;
          this.allcolors = res.response.data;
          console.log(this.colors);
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

  // a function to check images by colors
  _imageColorFieldChecker() {
    let response: any;
    this.colors.forEach(color => {
      if (color.id === null) {
        response = true;
      } else {
        color.pictures.forEach(picture => {
          if (picture.linktoimage === null) {
            response = true;
          } else {
            response = false;
          }
        });
      }
    });
    return response;
  }

  // a function to add a post
  _addPost() {
    if (this.post.amount === null || this.post.description === null || this.post.categoryid === null) {
      this.emptyFields = {
        error: true,
        message: 'please fill all fields before you add a product'
      };
    } else if (this.post.discount === null || this.post.instock === null || this.post.rate === null) {
      this.emptyFields = {
        error: true,
        message: 'please fill all fields before you add a product'
      };
    } else if (this._imageColorFieldChecker()) {
      this.emptyFields = {
        error: true,
        message: 'please fill all color and picture field or remove unnecessary fields'
      };
    } else {
      this.post.linktoimage = this.colors;
      this.emptyFields = {
        error: false,
        message: ''
      };
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
  }


  // put a post on sale
  _putOnSale(postid: number) {
    let onSaleObject: object = {
      postid: null,
      days: null
    };

    onSaleObject = {
      postid,
      days: this.onSaleDays
    };

    if (this.onSaleDays === null) { } else {
      this.http._putPostOnSale(onSaleObject).subscribe(
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
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  // function to update post
  _updPost() {
    this.http._updPost(this.currentPost).subscribe(
      res => {
        this._getPosts(this.sortBy, JSON.stringify(this.offset), this.order);
      },
      err => {
        console.log(err);
      }
    );
  }

  // add a color field
  _addColor() {
    this.colors.push({
      id: null,
      pictures: [
        {
          linktoimage: null
        }
      ]
    });
  }

  // remove a color field
  _removeColor(i: number) {
    if (this.colors.length === 1 && i === 0) { } else {
      this.colors.splice(i, 1);
    }
  }

  // add a picture field
  _addPicture(i: number) {
    this.colors[i].pictures.push(
      {
        linktoimage: null
      }
    );
  }

  // remove a picture field
  _removePicture(i: number, p: number) {
    if (this.colors[i].pictures.length === 1 && p === 0) { } else {
      this.colors[i].pictures.splice(p, 1);
    }
  }


  ngOnInit() {
    this._getPages();
    this._getPosts(this.sortBy, JSON.stringify(this.offset), this.order);
    this._getGender();
    this._getCategory();
    this._getColors();
  }

}
