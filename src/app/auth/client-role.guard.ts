import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn : 'root',
})
export class ClientRoleGuard implements CanActivate{

    constructor(private authService: AuthService, private router:Router){}

    canActivate(route: ActivatedRouteSnapshot,
                state : RouterStateSnapshot
                ) : boolean| UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {


                return this.authService.user.pipe(take(1), map( user => {
                    const isAuth = !!user;
                    if  (isAuth && user.role.toLowerCase() === 'user'){
                        return true;
                    }else if(isAuth && user.role.toLowerCase() === 'admin'){
                        return this.router.createUrlTree(['/admin']);
                    }else{
                        return this.router.createUrlTree(['/login']);
                    }
                }))

    }
}
