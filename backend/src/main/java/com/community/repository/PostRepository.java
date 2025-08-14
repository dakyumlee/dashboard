package com.community.repository;

import com.community.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p ORDER BY p.createdAt DESC")
    Page<Post> findAllOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.author.id = :authorId ORDER BY p.createdAt DESC")
    Page<Post> findByAuthorIdOrderByCreatedAtDesc(@Param("authorId") Long authorId, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.title LIKE %:keyword% OR p.content LIKE %:keyword% ORDER BY p.createdAt DESC")
    Page<Post> findByTitleContainingOrContentContainingOrderByCreatedAtDesc(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.author.id = :authorId")
    long countByAuthorId(@Param("authorId") Long authorId);
}