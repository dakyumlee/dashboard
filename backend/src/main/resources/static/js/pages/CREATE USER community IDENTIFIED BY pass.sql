CREATE USER community IDENTIFIED BY password;
GRANT CONNECT, RESOURCE, DBA TO community;
GRANT UNLIMITED TABLESPACE TO community;

CREATE SEQUENCE user_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE post_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE comment_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE like_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE users (
    id NUMBER PRIMARY KEY,
    email VARCHAR2(255) UNIQUE NOT NULL,
    password VARCHAR2(255) NOT NULL,
    department VARCHAR2(100) NOT NULL,
    job_position VARCHAR2(100) NOT NULL,
    nickname VARCHAR2(100) UNIQUE NOT NULL,
    role VARCHAR2(20) DEFAULT 'USER' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE posts (
    id NUMBER PRIMARY KEY,
    title VARCHAR2(255) NOT NULL,
    content CLOB NOT NULL,
    author_id NUMBER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id NUMBER PRIMARY KEY,
    content CLOB NOT NULL,
    post_id NUMBER NOT NULL,
    author_id NUMBER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE likes (
    id NUMBER PRIMARY KEY,
    user_id NUMBER NOT NULL,
    post_id NUMBER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

INSERT INTO users (id, email, password, department, job_position, nickname, role) 
VALUES (user_seq.NEXTVAL, 'admin@test.com', '$2a$10$e0MYzXyjpJS7Pd0RVvHqHOxuiOh5XWtAhta.GhzOuj8jTiHAEFiDe', '관리팀', '관리자', '관리팀-999', 'ADMIN');

INSERT INTO users (id, email, password, department, job_position, nickname, role)
VALUES (user_seq.NEXTVAL, 'user@test.com', '$2a$10$e0MYzXyjpJS7Pd0RVvHqHOxuiOh5XWtAhta.GhzOuj8jTiHAEFiDe', '개발팀', '개발자', '개발팀-001', 'USER');

COMMIT;