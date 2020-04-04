using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ModothStudy.App.Common;
using Microsoft.EntityFrameworkCore;
using ModothStudy.ServiceInterface.EntityServices;
using ModothStudy.Entity;
using ModothStudy.App.Models;
using System.Linq;
using ModothStudy.ServiceInterface.Common;
using ModothStudy.ServiceInterface.Lang;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace ModothStudy.App.Controllers
{

    [Route("api/[controller]")]
    public class WxController : Controller
    {
        [HttpGet]
        public async Task<Object> Get(string? signature, string? timestamp, string? nonce,
        string? echostr, [FromServices] IConfigsService configsService)
        {
            if (signature == null || timestamp == null || nonce == null)
            {
                throw new Exception();
            }
            var token = await configsService.AllConfigs(null).Where(c => c.Key == nameof(AppConfigs.CONFIG_WX_API_TOKEN)).FirstOrDefaultAsync();
            if (token == null || String.IsNullOrWhiteSpace(token.Value))
            {
                throw new ServiceException(nameof(UILangs.NoWxTokenFound));
            }
            if (!CheckSignature(signature, token.Value!, timestamp, nonce))
            {
                throw new ServiceException(nameof(UILangs.InvalidApiSignature));
            }
            if (echostr != null)
            {
                return echostr;
            }
            throw new NotImplementedException();
        }

        private bool CheckSignature(string signature, string token, string timestamp, string nonce)
        {
            var tokens = new List<string> { token, timestamp, nonce };
            tokens.Sort();
            var str = String.Join("", tokens);
            var e = new SHA1CryptoServiceProvider();
            var mSig = BinaryToHex(e.ComputeHash(Encoding.UTF8.GetBytes(str)));
            return String.Equals(mSig, signature.ToUpper(), StringComparison.CurrentCultureIgnoreCase);
        }

        private static string BinaryToHex(byte[] data)
        {
            char[] hex = new char[checked(data.Length * 2)];

            for (int i = 0; i < data.Length; i++)
            {
                byte thisByte = data[i];
                hex[2 * i] = NibbleToHex((byte)(thisByte >> 4));
                hex[2 * i + 1] = NibbleToHex((byte)(thisByte & 0xf));
            }

            return new string(hex);
        }

        private static char NibbleToHex(byte nibble)
        {
            return (char)((nibble < 10) ? (nibble + '0') : (nibble - 10 + 'A'));
        }
    }
}