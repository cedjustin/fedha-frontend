import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';


@Component({
  selector: 'app-dash-blog',
  templateUrl: './dash-blog.component.html',
  styleUrls: ['./dash-blog.component.scss']
})
export class DashBlogComponent implements OnInit {

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
  newBlog: any = {
    linktoimage: null,
    title: null,
    content: null
  };
  inPutError = 0;
  loadMore = 0;


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

  // get the selected blog
  _getCurrentBlog(blog: object) {
    this.currentBlog = blog;
  }

  // delete a blog
  _delBlog(id: number) {
    this.http._delBlog(id).subscribe(
      res => {
        // tslint:disable-next-line: triple-equals
        if (res.response.error == 0) {
          this._getBlogContent();
        } else { }
      },
      err => {
        this.connection = {
          error: 1,
          message: 'Connection problem, check your internet and refresh the page'
        };
      }
    );
  }


  // add a new blog
  _addBlog() {
    if (this.newBlog.title == null || this.newBlog.linktoimage == null || this.newBlog.content == null) {
      this.inPutError = 1;
    } else {
      this.inPutError = 0;
      this.newBlog.comments = '[]';
      this.http._addBlog(this.newBlog).subscribe(
        res => {

          this.newBlog = {
            title: null,
            linktoimage: null,
            content: null
          };

          this._getBlogContent();
        },
        err => {
          this.connection = {
            error: 1,
            message: 'Connection problem, check your internet and refresh the page'
          };
        }
      );
    }
  }

  // edit a blog
  _editBlog() {
    this.currentBlog.comments = JSON.stringify(this.currentBlog.comments);
    this.http._updBlogContent(this.currentBlog).subscribe(
      res => {
        // tslint:disable-next-line: triple-equals
        if (res.response.error == 0) {
          this._getBlogContent();
        } else {

        }
      },
      err => {
        this.connection = {
          error: 1,
          message: 'Connection problem, check your internet and refresh the page'
        };
      }
    );
  }

  // loadmore
  _loadmore() {
    if (this.loadMore === 3 || this.loadingData === 1) { } else {
      this.loadMore = 1;
      this.offSet = this.offSet + 10;
      this.http._getBlog(this.offSet).subscribe(
        res => {
          // tslint:disable-next-line: triple-equals
          if (res.response.error == 0) {
            this.loadingData = 0;
            res.response.data.forEach(element => {
              element.comments = JSON.parse(element.comments);
              element.commentsSize = element.comments.length;
            });
            this.blogData = [...this.blogData, res.response.data];
            this.dataLoaded = 1;
          } else { }
        },
        err => {
          this.connection = {
            error: 1,
            message: 'Connection problem, check your internet and refresh the page'
          };
        }
      );
    }
  }

  ngOnInit() {
    this._getBlogContent();
  }

}
