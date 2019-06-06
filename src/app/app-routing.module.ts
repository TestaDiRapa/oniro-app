import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './login/auth.guard';

const routes: Routes = [

  { path: '', redirectTo: 'authentication', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule', canLoad: [AuthGuard]},
  { path: 'authentication', loadChildren: './authentication/authentication.module#AuthenticationPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  //{ path: 'home/record', loadChildren: './record/record.module#RecordPageModule', canLoad: [AuthGuard]},
  { path: 'home/settings', loadChildren: './settings/settings.module#SettingsPageModule', canLoad: [AuthGuard]},
  { path: 'home/contacts', loadChildren: './contacts/contacts.module#ContactsPageModule', canLoad: [AuthGuard]},
  { path: 'home/diary', loadChildren: './diary/diary.module#DiaryPageModule', canLoad: [AuthGuard]},
  { path: 'home/gmaps', loadChildren: './gmaps/gmaps.module#GmapsPageModule', canLoad: [AuthGuard]},
  { path: 'home/info', loadChildren: './info/info.module#InfoPageModule', canLoad: [AuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
