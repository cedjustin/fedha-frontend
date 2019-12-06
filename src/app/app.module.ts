import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpService } from './http.service';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './token-interceptor.service';
import { DashPostComponent } from './dash-post/dash-post.component';
import { RatingModule } from 'ng-starrating';
import { GenderComponent } from './gender/gender.component';
import { OnSaleComponent } from './on-sale/on-sale.component';
import { OnDiscountComponent } from './on-discount/on-discount.component';
import { ProductsComponent } from './products/products.component';
import { ShopComponent } from './shop/shop.component';
import { CarouselComponent } from './carousel/carousel.component';
import { ShopInfoComponent } from './shop-info/shop-info.component';
import { DashBlogComponent } from './dash-blog/dash-blog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainComponent,
    LoginComponent,
    AdminComponent,
    DashboardComponent,
    DashPostComponent,
    GenderComponent,
    OnSaleComponent,
    OnDiscountComponent,
    ProductsComponent,
    ShopComponent,
    CarouselComponent,
    ShopInfoComponent,
    DashBlogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    RatingModule
  ],
  providers: [HttpService, AuthService, AuthGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
