package com.internship.brainboxx;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller

public class HomeController {
//    @RequestMapping("/")
//    public String index() {
//        return "index.html";
//    }

    @RequestMapping("/login")
    public String login() {
        return "login.html";
    }

    @RequestMapping("/")
    public String home() {
        return "home.html";
    }
}
