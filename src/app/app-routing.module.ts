import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'user-home', pathMatch: 'full' },
  { path: 'user-home', loadChildren: './user-home/user-home.module#UserHomePageModule' },
  { path: 'doc-home', loadChildren: './doc-home/doc-home.module#DocHomePageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
