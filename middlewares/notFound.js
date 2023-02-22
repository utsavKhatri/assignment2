/**
 * If the user requests a page that doesn't exist, 
 * the server will respond with a 404 status code 
 * and render the 404.ejs template
 */
const notFound = (req, res, next) => {
  res.status(400).render("404", { title: "404 not found" });
  next();
};
export { notFound };