//require express, express router and bcrypt as shown in lecture code

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
  })

router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
  })
  .post(async (req, res) => {
    //code here for POST
  })
 
router
  .route('/login')
  .post(async (req, res) => {
    //code here for POST
  })

router
  .route('/protected')
  .get(async (req, res) => {
    //code here for GET
  })

router
  .route('/logout')
  .get(async (req, res) => {
    //code here for GET
  })
