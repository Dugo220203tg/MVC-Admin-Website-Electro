using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PagedList;
using System.Text;
using TrangQuanLy.Models;

namespace TrangQuanLy.Controllers
{

    public class LoaiSpController : Controller
    {
        private readonly HttpClient _client;
        Uri baseAddress = new Uri("https://localhost:7109/api");
        public LoaiSpController()
        {
            _client = new HttpClient();
            _client.BaseAddress = baseAddress;
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
                pagesize = 9;
            }
            ViewBag.PageSize = pagesize;
            List<LoaiSpViewMD> LoaiSP = new List<LoaiSpViewMD>();
            HttpResponseMessage response = _client.GetAsync(_client.BaseAddress + "/DanhMucSp/GetAll").Result;

            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;
                LoaiSP = JsonConvert.DeserializeObject<List<LoaiSpViewMD>>(data);
            }
            int totalItems = LoaiSP.Count();
            decimal totalPages = Math.Ceiling((decimal)((decimal)totalItems / pagesize));
            ViewBag.TotalPages = totalPages;
            ViewBag.Page = page;
            return View(LoaiSP.ToPagedList((int)page, (int)pagesize));
        }
        [HttpGet]
        public async Task<IActionResult> Search(string? query)
        {
            // Initialize HangHoaVM list to store search results
            List<LoaiSpViewMD> searchResult = new List<LoaiSpViewMD>();

            // Send a request to the API to get all HangHoa entities
            List<LoaiSpViewMD> LoaiSp = new List<LoaiSpViewMD>();
            HttpResponseMessage response = _client.GetAsync(_client.BaseAddress + "/DanhMucSp/GetAll").Result;

            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;
                LoaiSp = JsonConvert.DeserializeObject<List<LoaiSpViewMD>>(data);
            }
            else
            {
                return View("Error");
            }
            if (query != null)
            {
                searchResult = LoaiSp.Where(h => h.TenLoai.Contains(query)).ToList();
                return View(searchResult);
            }
            if (query == null)
            {
                return View(LoaiSp);
            }
            return View();
        }
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public IActionResult Create(LoaiSpViewMD model)
        {
            try
            {
                string data = JsonConvert.SerializeObject(model);
                StringContent content = new StringContent(data, Encoding.UTF8, "application/json");
                HttpResponseMessage response = _client.PostAsync(_client.BaseAddress + "/DanhMucSp/Post", content).Result;

                if (response.IsSuccessStatusCode)
                {
                    TempData["successMessage"] = "Thêm danh mục mới thành công ";
                    return RedirectToAction("Index");
                }
            }
            catch (Exception ex)
            {
                TempData["errorMessage"] = ex.Message;
                return View();

            }
            return View();
        }
        [HttpGet]
        public IActionResult Edit(int id)
        {
            try
            {
                LoaiSpViewMD LoaiSp = new LoaiSpViewMD();
                HttpResponseMessage response = _client.GetAsync(_client.BaseAddress + "/DanhMucSp/GetById/" + id).Result;
                if (response.IsSuccessStatusCode)
                {
                    string data = response.Content.ReadAsStringAsync().Result;
                    LoaiSp = JsonConvert.DeserializeObject<LoaiSpViewMD>(data);
                }
                return View(LoaiSp);

            }
            catch (Exception ex)
            {
                TempData["errorMessage"] = ex.Message;
                return View();
            }
        }

        [HttpPost]
        public IActionResult Edit(LoaiSpViewMD model, int Maloai)
        {
            try
            {
                string data = JsonConvert.SerializeObject(model);
                StringContent content = new StringContent(data, Encoding.UTF8, "application/json");
                HttpResponseMessage response = _client.PutAsync(_client.BaseAddress + "/DanhMucSp/Update/" + Maloai, content).Result;
                if (response.IsSuccessStatusCode)
                {
                    TempData["successMessage"] = "Employee Update!";
                    return RedirectToAction("Index");
                }
                // Nếu có lỗi, trả về view và truyền model vào view
                return View();
            }
            catch (Exception ex)
            {
                TempData["errorMessage"] = ex.Message;
                // Nếu có lỗi, trả về view và truyền model vào view
                return View();
            }
        }


        [HttpPost, ActionName("Delete")]
        public IActionResult DeleteConfirm(int Maloai)
        {
            try
            {
                HttpResponseMessage response = _client.DeleteAsync(_client.BaseAddress + "/DanhMucSp/Delete/" + Maloai).Result;
                if (response.IsSuccessStatusCode)
                {
                    TempData["successMessage"] = "Employee Delete!";
                    return RedirectToAction("Index");
                }
                return View("Index", "LoaiSp");
            }
            catch (Exception ex)
            {
                TempData["errorMessage"] = ex.Message;
                return View();
            }
        }
    }

}
