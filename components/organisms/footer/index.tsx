
// Copyright &copy; 
// <script type="text/javascript"> 
// myDate = new Date();myYear = myDate.getFullYear();document.write(myYear); 
// </script>.インフルエンサーめぐり. All Rights reserved.


export default function Footer() {
    const year = new Date().getFullYear();
    return (<div className="bg-[#9E9E9E] py-[15px] text-center text-white ">
        Copyright © {year}.インフルエンサーめぐり. All Rights reserved.
    </div>)
}