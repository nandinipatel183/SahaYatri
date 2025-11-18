package com.practice.sevice;

import org.springframework.stereotype.Service;
import com.practice.model.LostItem;
import com.practice.repository.LostItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class ItemService {
	 @Autowired
	    private LostItemRepository repository;


	  public LostItem saveItem(LostItem item) {
	        return repository.save(item);
	    }

	    public List<LostItem> getAllItems() {
	        return repository.findAll();
	    }
}
