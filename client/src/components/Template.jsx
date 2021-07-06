import Navbar from './Navbar'
import Footer from './Footer'

function Template({children}) {
    return (
        <>
          <header>
            <Navbar/>
          </header>
          <main>
            {children}
          </main>
          <footer>
            <Footer/>
          </footer> 
        </>
    )
}

export default Template
