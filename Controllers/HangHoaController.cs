﻿using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using TrangQuanLy.Models;
using Microsoft.AspNetCore.Authorization;
using TrangQuanLy.Helpers;

namespace TrangQuanLy.Controllers
{
    public class HangHoaController : Controller
    {
        private readonly HttpClient _client;
        Uri baseAddress = new Uri("https://localhost:7109/api");
        public HangHoaController()
        {
            _client = new HttpClient();
            _client.BaseAddress = baseAddress;
        }
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Index(int? page, int? pagesize)
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

            List<HangHoaVM> Hanghoa = new List<HangHoaVM>();
            HttpResponseMessage response = await _client.GetAsync(_client.BaseAddress + "/HangHoa/GetAll");

            if (response.IsSuccessStatusCode)
            {
                string data = await response.Content.ReadAsStringAsync();
                Hanghoa = JsonConvert.DeserializeObject<List<HangHoaVM>>(data);
            }

            int totalItems = Hanghoa.Count();

            // Creating PaginatedList
            var paginatedList = PaginatedList<HangHoaVM>.CreateAsync(Hanghoa.AsQueryable(), page ?? 1, pagesize ?? 9);

            ViewBag.Page = page;
            ViewBag.TotalPages = paginatedList.TotalPages;

            return View(paginatedList);
        }
        [HttpGet]
        [Authorize]

        public async Task<IActionResult> Search(string? query)
        {
            // Initialize HangHoaVM list to store search results
            List<HangHoaVM> searchResult = new List<HangHoaVM>();

            // Send a request to the API to get all HangHoa entities
            List<HangHoaVM> Hanghoa = new List<HangHoaVM>();
            HttpResponseMessage response = _client.GetAsync(_client.BaseAddress + "/HangHoa/GetAll").Result;

            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;
                Hanghoa = JsonConvert.DeserializeObject<List<HangHoaVM>>(data);
            }
            else
            {
                return View("Error");
            }
            if(query != null)
            {
            searchResult = Hanghoa.Where(h => h.TenHH.Contains(query)).ToList();
            return View(searchResult);
            }
            if(query == null)
            {
                return View(Hanghoa);

            }
            return View();
        }

        [Authorize]
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }
        [HttpPost]
        [HttpPost]
        public IActionResult Create(CreateHangHoaVM model)
        {
            try
            {
                // Serialize the model
                string data = JsonConvert.SerializeObject(model);
                StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

                // Post the data to the API
                HttpResponseMessage response = _client.PostAsync(_client.BaseAddress + "/HangHoa/Post", content).Result;

                // Check if the response is successful
                if (response.IsSuccessStatusCode)
                {
                    TempData["success"] = "Thêm sản phẩm mới thành công";
                    return RedirectToAction("Index");
                }
                else
                {
                    TempData["error"] = "Không thể thêm sản phẩm. Vui lòng kiểm tra lại.";
                    return View(model); // Return the model to retain form data on error
                }
            }
            catch (Exception ex)
            {
                // Log the error message and return the model
                TempData["error"] = $"Có lỗi xảy ra: {ex.Message}";
                return View(model); // Return the model to keep form data
            }
        }
        [Authorize]
        [HttpGet]
        public IActionResult Edit(int id)
        {
            try
            {
                HangHoaVM hanghoa = new HangHoaVM();
                HttpResponseMessage respone = _client.GetAsync(_client.BaseAddress + "/HangHoa/GetById/" + id).Result;
                if (respone.IsSuccessStatusCode)
                {
                    string data = respone.Content.ReadAsStringAsync().Result;
                    hanghoa = JsonConvert.DeserializeObject<HangHoaVM>(data);
                }
                return View(hanghoa);

            }
            catch (Exception ex)
            {
                TempData["error"] = ex.Message;
                return View();
            }
        }
        [Authorize]
        [HttpPost]
        public IActionResult Edit(AllHangHoaVM model, int MaHH)
        {
            try
            {
                string data = JsonConvert.SerializeObject(model);
                StringContent content = new StringContent(data, Encoding.UTF8, "application/json");
                HttpResponseMessage response = _client.PutAsync(_client.BaseAddress + "/HangHoa/Update/" + MaHH, content).Result;
                if (response.IsSuccessStatusCode)
                {
                    TempData["success"] = "Employee Update!";
                    return RedirectToAction("Index");
                }
                return View();
            }
            catch (Exception ex)
            {
                TempData["error"] = ex.Message;
                return View();
            }
        }
        [Authorize]
        [HttpPost, ActionName("Delete")]
        public IActionResult DeleteConfirm( int MaHH)
        {
            try
            {
                HttpResponseMessage response = _client.DeleteAsync(_client.BaseAddress + "/HangHoa/Delete/" + MaHH).Result;
                if (response.IsSuccessStatusCode)
                {
                    TempData["success"] = "Employee Delete!";
                    return RedirectToAction("Index");
                }
                return View("Index","HangHoa");
            }
            catch (Exception ex)
            {
                TempData["error"] = ex.Message;
                return View();
            }
        }
    }
}
