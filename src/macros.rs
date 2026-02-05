#[macro_export]
macro_rules! files_router {
    ($($key:literal => $value:literal),* $(,)?) => {
        {
            let router: Router<()> = Router::new();
    
            router
                $(.route($key, get_service(ServeFile::new($value))))*
        }
    };
}