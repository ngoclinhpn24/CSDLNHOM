class UserComponent {
    static account = `
    <div class="d-flex justify-content-between">
                
        <div class="sign-in-container">
            <h4 class="text-center">Sign In</h4>
            <form method="POST" onsubmit="AuthHandler.signIn(event)" class="form form-sign-in">
                <div class="form-group">
                    <label>Email: </label>
                    <input type="email" name="email" class="form-control form-control-sm">
                    <small class="email-error text-danger"></small>
                </div>

                <div class="form-group">
                    <label for="password">Password: </label>
                    <input type="password" name="password" class="form-control form-control-sm">
                    <small class="password-error text-danger"></small>
                </div>

                <div class="form-group">
                    <input type="checkbox" name="" id="remember-me">
                    <label for="remember-me"> Remember me</label>

                    <a href="#" class="float-right">Forgot password?</a>
                </div>
                <button class="btn btn-primary">Sign In</button><br>
                <small class="sign-in-error text-danger"></small>
            </form>
        </div>

        <div class="line-separator"></div>

        <div class="sign-up-container">
            <h4 class="text-center">Sign Up</h4>
            <form method="POST" onsubmit="AuthHandler.signUp(event)" class="form form-sign-up">

                <div class="form-group">
                    <label for="name">Your name: </label>
                    <input type="text" name="name" class="form-control form-control-sm">
                    <small class="name-error text-danger"></small>
                </div>

                <div class="form-group">
                    <label>Email: </label>
                    <input type="email" name="email" class="form-control form-control-sm">
                    <small class="email-error text-danger"></small>
                </div>

                <div class="form-group">
                    <label for="password">Password: </label>
                    <input type="password" name="password" class="form-control form-control-sm">
                    <small class="password-error text-danger"></small>
                </div>

                <div class="form-group">
                    <label for="confirm-password">Confirm Password: </label>
                    <input type="password" name="confirmPassword" class="form-control form-control-sm">
                    <small class="confirmPassword-error text-danger"></small>
                </div>

                <button class="btn btn-success">Sign Up</button><br>
                <small class="sign-up-error text-danger"></small>
                <small class="sign-up-success text-success"></small>
            </form>
        </div>
    </div>`;

    static profile = `

    `;


    static showAccount(){
        $("#main-content").html(this.account);
    }

    static showProfile(){
        $("#main-content").html(this.profile);
    }
}