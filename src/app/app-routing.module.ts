import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './login/auth.guard';
import { IsUserGuard } from './is-user.guard';
import { IsDocGuard } from './is-doc.guard';

const routes: Routes = [

  { path: '', redirectTo: 'authentication', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule', canLoad: [AuthGuard, IsUserGuard]},
  { path: 'authentication', loadChildren: './authentication/authentication.module#AuthenticationPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'home/record', loadChildren: './home/record/record.module#RecordPageModule', canLoad: [AuthGuard, IsUserGuard]},
  { path: 'home/settings', loadChildren: './home/settings/settings.module#SettingsPageModule', canLoad: [AuthGuard, IsUserGuard]},
  { path: 'home/contacts', loadChildren: './home/contacts/contacts.module#ContactsPageModule', canLoad: [AuthGuard, IsUserGuard]},
  { path: 'home/diary', loadChildren: 'src/app/home/diary/diary.module#DiaryPageModule', canLoad: [AuthGuard, IsUserGuard]},
  { path: 'home/gmaps', loadChildren: 'src/app/home/gmaps/gmaps.module#GmapsPageModule', canLoad: [AuthGuard, IsUserGuard]},
  { path: 'home/info', loadChildren: 'src/app/home/info/info.module#InfoPageModule', canLoad: [AuthGuard, IsUserGuard]},
  { path: 'homedoc', loadChildren: 'src/app/homedoc/homedoc.module#HomedocPageModule', canLoad: [IsDocGuard, AuthGuard]},
  { path: 'homedoc/settings', loadChildren: './homedoc/settings/settings.module#SettingsPageModule', canLoad: [IsDocGuard, AuthGuard] },
// tslint:disable-next-line: max-line-length
  { path: 'homedoc/richieste-pazienti', loadChildren: './homedoc/richieste-pazienti/richieste-pazienti.module#RichiestePazientiPageModule', canLoad: [IsDocGuard,AuthGuard] }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
