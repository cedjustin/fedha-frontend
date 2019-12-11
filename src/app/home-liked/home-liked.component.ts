import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-home-liked',
  templateUrl: './home-liked.component.html',
  styleUrls: ['./home-liked.component.scss']
})
export class HomeLikedComponent implements OnInit {
  selectedPostIndex = null;
  allColors = [];
  likedPosts = [];
  posts: any = [];
  searchedValue = null;
  loadingPosts = 0;
  selectedPost: any = {
    name: null,
    description: null,
    amount: null,
    sizes: {
      data: []
    },
    selectedColor: null,
    linktoimage: [
      { colorid: '2', pictures: Array(1), colorinfo: {} }
    ]
  };
  postsLoaded = 0;
  noResult = 0;
  quickViewCarousel: any = {
    selectedImage: null
  };
  position = 0;
  categories: any;
  genders: any;
  category: any;
  types = null;
  shopinfo: any;

  constructor(private http: HttpService) { }

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

  // get data that was searched from backend
  _getSearchedData() {
    this.noResult = 0;
    this.postsLoaded = 0;
    this.loadingPosts = 1;
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts'));
    this.allColors = JSON.parse(localStorage.getItem('colors'));
    // tslint:disable-next-line: triple-equals
    if (likedPosts != null || likedPosts.length > 0) {
      this.loadingPosts = 0;
      this.postsLoaded = 1;
      this.posts = likedPosts;
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
          element.colorinfo = this.allColors.find(color => {
            // tslint:disable-next-line: triple-equals
            return color.id == JSON.parse(element.colorid);
          });
        });
      });
    } else {
      this.noResult = 1;
    }
  }

  // a function to get colors
  _getColors() {
    this.http._getColors().subscribe(
      res => {
        if (res.response.error === 1 && res.response.message === 'you have no colors in db') {
        } else {
          this.allColors = res.response.data;
          localStorage.setItem('colors', JSON.stringify(this.allColors));
        }
      },
      err => {
        console.log(err);
      }
    );
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

  // change background colorid
  changeBgColor(color) {
    const styles = {
      'background-color': color === undefined ? 'white' : color.colorcode
    };
    return styles;
  }

  ngOnInit() {
    this._getColors();
    this._getSearchedData();
    this._getLocalData();
  }
}
