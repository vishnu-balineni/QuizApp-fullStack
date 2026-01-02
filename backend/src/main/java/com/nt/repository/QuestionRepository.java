package com.nt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nt.entity.Question;

@Repository
public interface QuestionRepository extends JpaRepository<Question,Long>{

}
