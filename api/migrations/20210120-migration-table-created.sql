
CREATE TABLE IF NOT EXISTS migration (
    `path` text not null,
	id int primary key,
    `createdAt` datetime ,
    `updatedAt` datetime    
    );
  
  
  insert into migration(`path`) values  
    ('20210120-initial-db.sql');
    