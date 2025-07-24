package com.internship.brainboxx;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BrainboxxApplication {

    public static void main(String[] args) {
        SpringApplication.run(BrainboxxApplication.class, args);
        System.out.println("http://localhost:8080/");
    }

}
