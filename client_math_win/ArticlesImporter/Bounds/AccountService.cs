using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ArticlesImporter.Bounds
{
    public class Account
    {
        public string userName { get; set; }

        public string password { get; set; }
    }

    public class AccountService
    {
        private Func<Account> get_;
        public AccountService(Func<Account> get)
        {
            get_ = get;
        }
        public Account Get()
        {
            return get_ == null ? null : get_();
        }
    }
}
