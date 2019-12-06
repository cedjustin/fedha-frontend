import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { DashPostComponent } from './dash-post/dash-post.component';
import { GenderComponent } from './gender/gender.component';
import { OnSaleComponent } from './on-sale/on-sale.component';
import { OnDiscountComponent } from './on-discount/on-discount.component';
import { ProductsComponent } from './products/products.component';
import { ShopComponent } from './shop/shop.component';
import { CarouselComponent } from './carousel/carousel.component';
import { ShopInfoComponent } from './shop-info/shop-info.component';
import { DashBlogComponent } from './dash-blog/dash-blog.component';


const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: MainComponent,
        children: [
          {
            path: '',
            component: ProductsComponent
          }
        ]
      },
      {
        path: 'shop',
        component: ShopComponent,
        children: [
          {
            path: '',
            component: ProductsComponent
          }
        ]
      }
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', component: LoginComponent },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', component: DashPostComponent },
          { path: 'onsale', component: OnSaleComponent },
          { path: 'ondiscount', component: OnDiscountComponent },
          { path: 'gender', component: GenderComponent },
          { path: 'carousel', component: CarouselComponent },
          { path: 'shop-info', component: ShopInfoComponent },
          { path: 'blog', component: DashBlogComponent },
        ]
      }
    ]
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
