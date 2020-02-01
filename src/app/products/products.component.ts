import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  // variables
  showSearch = false;
  showFilter = false;
  posts: any = [];
  unfilteredPosts: any = [];
  postsData: any = [];
  allcolors: any = [];
  offset = 0;
  order = 'DESC';
  sortBy = 'datecreated';
  loadingMore = 0;
  tab = 'all';
  selectedPost: any = {
    name: null,
    description: null,
    amount: null,
    sizes: {
      data: []
    },
    selectedColor: null,
    selectedImages: null
  };
  quickViewCarousel: any = {
    selectedImage: null
  };
  position = 0;
  categories: any;
  genders: any;
  category: any;
  likedPosts = [];
  selectedPostIndex = null;
  loadingPosts = 0;
  sortStatus = 'datecreated';
  filterCondition = 'default';
  types = null;
  selectedTab = {
    condition: null,
    value: null
  };
  shopinfo: any;

  constructor(private http: HttpService, private router: Router) { }

  changeFilterSearch() {
    this.showSearch = false;
    this.showFilter = !this.showFilter;
  }

  _getShopInfo() {
    this.http._getShopInfo().subscribe(
      res => {
        localStorage.setItem('shopinfo', JSON.stringify(res.response.data));
        this._getLocalData();
      },
      err => {
      }
    );
  }

  _getLocalData() {
    const value = JSON.parse(localStorage.getItem('shopinfo'));
    if (value == null) {
      this._getShopInfo();
    } else {
      this.shopinfo = value;
    }
  }

  // get posts by conditions
  _getPostsByConditions(condition: any, offset: any, value: any) {
    this.posts = [];
    this.loadingPosts = 1;
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts'));
    this.http._getPostsByCondition(condition, offset, value).subscribe(
      res => {
        if (res.response.error === 1 && res.response.message === 'you have no posts') {
          this.posts = [];
          this.loadingPosts = 0;
        } else {
          console.log(res.response.data);
          this.posts = res.response.data;
          // restructuring the posts array
          this.posts.forEach(post => {
            if (likedPosts == null) {
              post.liked = 0;
            } else {
              // getting liked posts
              likedPosts.forEach(liked => {
                post.liked = post.id === liked.id ? 1 : 0;
                if (post.id === liked.id) {
                  post.like = 1;
                }
              });
            }
            post.linktoimage = JSON.parse(post.linktoimage);
            post.sizes = JSON.parse(post.sizes);
            // getting colorinfo
            post.linktoimage.forEach(element => {
              element.colorinfo = this.allcolors.find(color => {
                // tslint:disable-next-line: triple-equals
                return color.id == JSON.parse(element.colorid);
              });
            });
          });
          this._checkIfSaleExp();
          this.unfilteredPosts = this.posts;
          this.loadingPosts = 0;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  // a function to get all posts
  _getPosts(sortby: any, offset: any, order: any) {
    this.loadingPosts = 1;
    this.http._getAllPosts(sortby, offset, order).subscribe(
      res => {
        if (res.response.error === 1 && res.response.message === 'you have no posts') {
          this.posts = [];
          this.loadingPosts = 0;
        } else {
          this.posts = res.response.data;
          this.unfilteredPosts = this.posts;
          this.loadingPosts = 0;
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
          localStorage.setItem('colors', JSON.stringify(this.allcolors));
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
      if (this.sortStatus === 'datecreated') {
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
                    // tslint:disable-next-line: triple-equals
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
      } else {
        this.http._getPostsByCondition(this.selectedTab.condition, JSON.stringify(this.offset), this.selectedTab.value).subscribe(
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
                    // tslint:disable-next-line: triple-equals
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
  }

  // when a post is selected
  _selectPost(post: any, index: number) {
    this.selectedPostIndex = index;
    this.selectedPost = post;
    this.selectedPost.selectedColor = post.linktoimage[0].colorinfo.name;
    const images = post.linktoimage.find(element => {
      return element.colorinfo.name === this.selectedPost.selectedColor;
    });
    this.selectedPost.selectedImages = images.pictures;
    this.quickViewCarousel.selectedImage = images.pictures[0].linktoimage;
    this._carouselHandler('default');
  }

  // a function to handle more details carousel
  _carouselHandler(status) {
    const positions = this.selectedPost.selectedImages.length - 1;
    if (status === 'next') {
      this.position = this.position === positions ? 0 : this.position += 1;
      if (this.position > positions) {
        this.position = 0;
        this.quickViewCarousel.selectedImage = this.selectedPost.selectedImages[this.position].linktoimage;
      } else {
        this.quickViewCarousel.selectedImage = this.selectedPost.selectedImages[this.position].linktoimage;
      }
    } else if (status === 'prev') {
      this.position = this.position === 0 ? positions : this.position -= 1;
      if (this.position < 0) {
        this.position = positions;
        this.quickViewCarousel.selectedImage = this.selectedPost.selectedImages[this.position].linktoimage;
      } else {
        this.quickViewCarousel.selectedImage = this.selectedPost.selectedImages[this.position].linktoimage;
      }
    } else {
      this.quickViewCarousel.selectedImage = this.selectedPost.selectedImages[this.position].linktoimage;
    }
  }

  // when a color changes
  _onColorChange() {
    const images = this.selectedPost.linktoimage.find(element => {
      return element.colorinfo.name === this.selectedPost.selectedColor;
    });
    this.selectedPost.selectedImages = images.pictures;
    this.quickViewCarousel.selectedImage = images.pictures[0].linktoimage;
  }

  // a function to get genders
  _getGender() {
    this.http._getGender().subscribe(
      res => {
        if (res.response.error === 1 && res.response.message === 'you have no gender in db') {
        } else {
          this.genders = res.response.data;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  // a function to get categories
  _getCategory() {
    this.http._getCategory().subscribe(
      res => {
        if (res.response.error === 1 && res.response.message === 'you have no categories in db') {
        } else {
          this.categories = res.response.data;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  // a function to get all types
  _getTypes() {
    this.http._getTypes().subscribe(
      res => {
        if (res.response.error === 1 && res.response.message === 'you have no types in db') {
        } else {
          this.types = res.response.data;
        }
      },
      err => {
        console.log(err);
      }
    );
  }


  // when a post is liked
  _onLike(i: number) {
    // tslint:disable-next-line: triple-equals
    const index = i == undefined ? this.selectedPostIndex : i;
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts'));
    if (likedPosts == null) {
      this.posts[index].liked = 1;
      this.likedPosts.push(this.posts[index]);
      localStorage.setItem('likedPosts', JSON.stringify(this.likedPosts));
    } else {
      const post = likedPosts.find(element => {
        return element.id === this.posts[index].id;
      });
      // tslint:disable-next-line: triple-equals
      if (post == undefined) {
        this.posts[index].liked = 1;
        this.likedPosts.push(this.posts[index]);
        localStorage.setItem('likedPosts', JSON.stringify(this.likedPosts));
      } else {
        this.posts[index].liked = 0;
        this.posts[index].like = 0;
        const postindex = likedPosts.indexOf(post);
        this.likedPosts.splice(postindex, 1);
        localStorage.setItem('likedPosts', JSON.stringify(this.likedPosts));
      }
    }
  }

  // on sort Page
  _onSortChange(status: any) {
    this.offset = 0;
    this.loadingMore = 0;
    if (status === this.sortStatus) { } else if (status === 'female') {
      this.sortStatus = 'female';
      const gender = this.genders.find(element => {
        // tslint:disable-next-line: triple-equals
        return element.name == status;
      });
      this.selectedTab = {
        condition: 'genderid',
        value: JSON.stringify(gender.id)
      };
      this._getPostsByConditions('genderid', JSON.stringify(this.offset), JSON.stringify(gender.id));
    } else if (status === 'male') {
      this.sortStatus = 'male';
      const gender = this.genders.find(element => {
        // tslint:disable-next-line: triple-equals
        return element.name == status;
      });
      this.selectedTab = {
        condition: 'genderid',
        value: JSON.stringify(gender.id)
      };
      this._getPostsByConditions('genderid', JSON.stringify(this.offset), JSON.stringify(gender.id));
    } else if (status === 'shoes') {
      this.sortStatus = 'shoes';
      const type = this.types.find(element => {
        // tslint:disable-next-line: triple-equals
        return element.name == status;
      });
      this.selectedTab = {
        condition: 'producttype',
        value: JSON.stringify(type.id)
      };
      this._getPostsByConditions('producttype', JSON.stringify(this.offset), JSON.stringify(type.id));
    } else if (status === 'clothes') {
      this.sortStatus = 'clothes';
      const type = this.types.find(element => {
        // tslint:disable-next-line: triple-equals
        return element.name == status;
      });
      this.selectedTab = {
        condition: 'producttype',
        value: JSON.stringify(type.id)
      };
      this._getPostsByConditions('producttype', JSON.stringify(this.offset), JSON.stringify(type.id));
    } else if (status === 'accessories') {
      this.sortStatus = 'accessories';
      const type = this.types.find(element => {
        // tslint:disable-next-line: triple-equals
        return element.name == status;
      });
      this.selectedTab = {
        condition: 'producttype',
        value: JSON.stringify(type.id)
      };
      this._getPostsByConditions('producttype', JSON.stringify(this.offset), JSON.stringify(type.id));
    } else if (status === 'default') {
      this.sortStatus = 'datecreated';
      this.selectedTab = {
        condition: 'datecreated',
        value: ''
      };
      this._getPosts(this.sortBy, JSON.stringify(this.offset), this.order);
    }
  }

  // change background colorid
  changeBgColor(color) {
    const styles = {
      'background-color': color === undefined ? 'white' : color.colorcode
    };
    return styles;
  }

  // sort data
  _sort(condition) {
    if (condition === 'id descending order') {
      this.filterCondition = condition;
      this.posts = this.unfilteredPosts;
    } else if (condition === 'price descending order') {
      this.filterCondition = condition;
      this.posts.sort((a, b) => {
        return Number(b.amount) - Number(a.amount);
      });
    } else if (condition === 'price ascending order') {
      this.filterCondition = condition;
      this.posts.sort((a, b) => {
        return Number(a.amount) - Number(b.amount);
      });
    } else if (condition === 'price between 0 to 10k') {
      this.filterCondition = condition;
      this.posts = this.unfilteredPosts.filter(item => {
        return item.amount > 0 && item.amount <= 10000;
      });
    } else if (condition === 'price between 10k to 50k') {
      this.filterCondition = condition;
      this.posts = this.unfilteredPosts.filter(item => {
        return item.amount > 10000 && item.amount <= 50000;
      });
    } else if (condition === 'price above 50k') {
      this.filterCondition = condition;
      this.posts = this.unfilteredPosts.filter(item => {
        return item.amount > 50000;
      });
    }
  }


  _getData() {
    const value = localStorage.getItem('sortstatus');
    if (value == null) {
      this._getPosts(this.sortBy, JSON.stringify(this.offset), this.order);
    } else {
      if (value === 'female') {
        this.sortStatus = 'female';
        this.selectedTab = {
          condition: 'genderid',
          value: JSON.stringify(6)
        };
        this._getPostsByConditions('genderid', JSON.stringify(this.offset), JSON.stringify(6));
      } else if (value === 'male') {
        this.sortStatus = 'male';
        this.selectedTab = {
          condition: 'genderid',
          value: JSON.stringify(4)
        };
        this._getPostsByConditions('genderid', JSON.stringify(this.offset), JSON.stringify(4));
      } else {
        this._getPosts(this.sortBy, JSON.stringify(this.offset), this.order);
      }
    }
  }

  // check selected image length
  _checkImageLength(images: any) {
    if (images === null || images.length > 1) { return true } else { return false }
  }

  ngOnInit() {
    this._getLocalData();
    this._getColors();
    this._getCategory();
    this._getGender();
    this._getTypes();
    this._getData();
  }
}
