import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;

    constructor(private auth: AuthenticationService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        if (this.auth.isAuthenticated()) {
            this.router.navigate(['/dashboard'], { relativeTo: this.route });
        } else {
            this.auth.obsRunning$.subscribe((data: boolean) => {
                this.loading = data;
            });
        }

    }

    login() {
        this.auth.login(this.model.username, this.model.password)
    }

}
