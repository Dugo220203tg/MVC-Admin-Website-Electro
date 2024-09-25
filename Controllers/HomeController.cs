using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Security.Claims;
using TrangQuanLy.Models;
using Newtonsoft.Json;
using System.Text;
using System.Net.Http;
using Microsoft.AspNetCore.Authorization;
using PagedList;

namespace TrangQuanLy.Controllers
{
	public class HomeController : Controller
	{
        private readonly HttpClient _client;
        Uri baseAddress = new Uri("https://localhost:7109/api");
        public HomeController(ILogger<HomeController> logger)
		{
            _client = new HttpClient();
            _client.BaseAddress = baseAddress;
        }
		public IActionResult Privacy()
		{
			return View();
        }
        [Authorize]
        [HttpGet]
        public IActionResult Index(int? page, int? pagesize)
        {
            if (page == null)
            {
                page = 1;
            }
            if (pagesize == null)
            {
                pagesize = 5;
            }
            ViewBag.PageSize = pagesize;
            List<HoaDonViewModel> HoaDon = new List<HoaDonViewModel>();
            HttpResponseMessage response = _client.GetAsync(_client.BaseAddress + "/HoaDon/GetAll").Result;

            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;
                HoaDon = JsonConvert.DeserializeObject<List<HoaDonViewModel>>(data);
            }
            int totalItems = HoaDon.Count();
            int totalPages = (int)Math.Ceiling((decimal)((decimal)totalItems / (decimal)pagesize));
            ViewBag.TotalPages = totalPages;
            ViewBag.Page = page;
            return View(HoaDon.ToPagedList((int)page, (int)pagesize));
        }
        [HttpGet]
        public IActionResult Edit(int id)
        {
            try
            {
                HoaDonViewModel hoadon = new HoaDonViewModel();
                HttpResponseMessage response = _client.GetAsync(_client.BaseAddress + "/HoaDon/GetById/" + id).Result;
                if (response.IsSuccessStatusCode)
                {
                    string data = response.Content.ReadAsStringAsync().Result;
                    hoadon = JsonConvert.DeserializeObject<HoaDonViewModel>(data);
                }
                return View(hoadon);
            }
            catch (Exception ex)
            {
                TempData["errorMessage"] = ex.Message;
                return View();
            }
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Edit(HoaDonViewModel model, int MaHd)
        {
            try
            {
                string data = JsonConvert.SerializeObject(model);
                StringContent content = new StringContent(data, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await _client.PutAsync(_client.BaseAddress + "/HoaDon/Update/" + MaHd, content);
                if (response.IsSuccessStatusCode)
                {
                    TempData["successMessage"] = "Hóa đơn đã được cập nhật!";
                    return RedirectToAction("Index");
                }
                return View(model);
            }
            catch (Exception ex)
            {
                TempData["errorMessage"] = ex.Message;
                return View(model);
            }
        }

        [HttpGet]
        public async Task<IActionResult> Search(string? query)
        {
            // Initialize HangHoaVM list to store search results
            List<HoaDonViewModel> searchResult = new List<HoaDonViewModel>();

            // Send a request to the API to get all HangHoa entities
            List<HoaDonViewModel> HoaDon = new List<HoaDonViewModel>();
            HttpResponseMessage response = _client.GetAsync(_client.BaseAddress + "/HoaDon/GetAll").Result;

            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;
                HoaDon = JsonConvert.DeserializeObject<List<HoaDonViewModel>>(data);
            }
            else
            {
                return View("Error");
            }
            if (query != null)
            {
                searchResult = HoaDon.Where(h => h.HoTen.Contains(query) ).ToList();
                return View(searchResult);
            }
            if (query == null)
            {
                return View(HoaDon);
            }
            return View();
        }




        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
