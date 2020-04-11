using System.Collections.Generic;
using System.Linq;
using ModothStudy.ServiceInterface.CommonServices;
using Newtonsoft.Json;

namespace ModothStudy.Service.CommonServices
{
    public class WxMenuConvertService : IWxMenuConvertService
    {
        private readonly string BUTTON_URL_SURFIX = "/%20/0";

        private readonly int MAX_MENU_COUNT_1 = 3;

        private readonly int MAX_MENU_COUNT_2 = 5;
        private class Menu
        {
            public string? Name { get; set; }

            public Menu[]? Children { get; set; }
        }

        private class MenuConfig
        {
            public Menu[]? Menus { get; set; }
        }

        private class WxMenu
        {
            [JsonProperty("button")]
            public List<WxButton> Buttons { get; } = new List<WxButton>();
        }

        private abstract class WxButton
        {
            [JsonProperty("name")]
            public string? Name { get; set; }
        }

        private class WxViewButton : WxButton
        {
            [JsonProperty("type")]
            public string? Type { get; } = "view";

            [JsonProperty("url")]
            public string? Url { get; set; }
        }

        private class WxGroupButton : WxButton
        {
            [JsonProperty("sub_button")]
            public List<WxButton> SubButtons { get; set; } = new List<WxButton>();
        }

        public string Convert(string? menu, string? basicUrl, string? homeName)
        {
            var wxMenu = new WxMenu();
            if (!string.IsNullOrWhiteSpace(basicUrl))
            {
                basicUrl!.TrimEnd('/');
            }
            if (!string.IsNullOrWhiteSpace(basicUrl))
            {
                var remain_menu_1 = MAX_MENU_COUNT_1;
                var remain_menu_2 = MAX_MENU_COUNT_2;
                // if (!string.IsNullOrWhiteSpace(homeName))
                // {
                //     wxMenu.Buttons.Add(new WxViewButton { Name = homeName, Url = basicUrl });
                //     remain_menu_1--;
                // }
                if (!string.IsNullOrWhiteSpace(menu))
                {
                    var menuItems = JsonConvert.DeserializeObject<MenuConfig>(menu).Menus;
                    if (menuItems == null)
                    {
                        menuItems = new Menu[0];
                    }
                    foreach (var p in menuItems)
                    {
                        if (remain_menu_1-- <= 0)
                        {
                            break;
                        }
                        if (string.IsNullOrWhiteSpace(p.Name))
                        {
                            continue;
                        }
                        if (p.Children == null || p.Children.Length == 0)
                        {
                            wxMenu.Buttons.Add(new WxViewButton { Name = p.Name, Url = $"{basicUrl}/{p.Name}{BUTTON_URL_SURFIX}" });
                            continue;
                        }
                        var pButton = new WxGroupButton { Name = p.Name };
                        wxMenu.Buttons.Add(pButton);
                        foreach (var c in p.Children)
                        {
                            if (remain_menu_2-- <= 0)
                            {
                                break;
                            }
                            if (string.IsNullOrWhiteSpace(c.Name))
                            {
                                continue;
                            }
                            var urlSurfix = (c.Children == null || c.Children.Length == 0) ? BUTTON_URL_SURFIX : string.Empty;
                            pButton.SubButtons.Add(new WxViewButton { Name = c.Name, Url = $"{basicUrl}/{p.Name}/{c.Name}{urlSurfix}" });
                        }
                    }
                }
            }
            return JsonConvert.SerializeObject(wxMenu);
        }
    }
}