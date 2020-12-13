begin transaction; 

insert into users (name, email, entries, joined) values (
    'Jessie', 'jessie@gmail.com', 5, '2018-01-01'
); 

insert into login(hash, email) values (
 '$2a$10$4KhjhqMhGocCbMkhueJP0O0pxMwj/uGeBXlGEOLRiw741a9Y.Cgq.', 'jessie@gmail.com'
);

commit; 