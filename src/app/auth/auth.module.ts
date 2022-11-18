import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";
import { AuthLoginComponent } from "./auth-login.component";
import { RegisterComponent } from "./register/register.component";

@NgModule({
    declarations:[
        AuthLoginComponent,
        RegisterComponent,
    ],
    imports:[
        SharedModule
    ]
})
export class AuthModule {

}
