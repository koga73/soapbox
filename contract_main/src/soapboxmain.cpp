#include <stdio.h>
#include <string>

#include <soapboxmain.hpp>

using namespace eosio;
using namespace std;
using namespace std::chrono;

const string soapboxmain::TOKEN_SYMBOL = "SOAP";
const int soapboxmain::PRECISION = 4;
const symbol soapboxmain::SYM = symbol(TOKEN_SYMBOL, PRECISION);

ACTION soapboxmain::init(asset shout_cost)
{
   string func = string(__func__) + string(": ");

   require_auth(get_self());

   check(shout_cost.symbol == SYM, func + "invalid symbol");

   auto the_bank = bank.get_or_create(get_self(), bank_table{});
   the_bank.shout_cost = shout_cost;
   bank.set(the_bank, _self);
}

// Deposit tokens from external source into local account balance
#if TESTNET
[[eosio::on_notify("soapboxtoken::transfer")]] void soapboxmain::deposit(name &from, name &to, asset &quantity, string &memo)
#else
[[eosio::on_notify("soapboxt.gm::transfer")]] void soapboxmain::deposit(name &from, name &to, asset &quantity, string &memo)
#endif
{
   string func = string(__func__) + string(": ");

   require_auth(from);

   check(from != get_self(), func + "invalid deposit");
   check(to == get_self(), func + "invalid deposit");
   check(quantity.amount > 0, func + "invalid deposit");
   check(quantity.symbol == SYM, func + "invalid symbol");

   uint64_t now_seconds = (uint64_t)current_time_point().sec_since_epoch();

   // Find user and upsert
   auto itr = _users.find(from.value);
   if (itr != _users.end())
   {
      _users.modify(itr, same_payer, [&](auto &row)
                    {
         row.balance = asset(itr->balance.amount + quantity.amount, SYM);
         row.date_modified = now_seconds; });
   }
   else
   {
      _users.emplace(_self, [&](auto &row)
                     {
         row.alias = from;
         row.balance = asset(quantity.amount, SYM);
         row.shout = "";
         row.tag = "";
         row.date_created = now_seconds;
         row.date_modified = now_seconds; });
   }
}

ACTION soapboxmain::shout(name &alias, string &shout, string &tag)
{
   string func = string(__func__) + string(": ");

   require_auth(alias);

   check(shout.size() <= 256, func + "shout cannot be longer than 256 characters");
   check(tag.size() <= 32, func + "tag cannot be longer than 32 characters");

   uint64_t now_seconds = (uint64_t)current_time_point().sec_since_epoch();

   // Find user and upsert
   auto itr = _users.find(alias.value);
   if (itr != _users.end())
   {
      // Transfer to bank
      if (itr->shout.size() != 0)
      {
         bank_table the_bank = bank.get();
         internal_transfer_to_bank(alias, the_bank.shout_cost.amount);
      }

      _users.modify(itr, same_payer, [&](auto &row)
                    {
         row.shout = shout;
         row.tag = tag;
         row.date_modified = now_seconds; });
   }
   else
   {
      _users.emplace(_self, [&](auto &row)
                     {
         row.alias = alias;
         row.balance = asset(0, SYM);
         row.shout = shout;
         row.tag = tag;
         row.date_created = now_seconds;
         row.date_modified = now_seconds; });
   }
}

ACTION soapboxmain::follow(name &alias, name &follow)
{
   string func = string(__func__) + string(": ");

   require_auth(alias);

   auto itr = _users.require_find(alias.value, (func + "user not found").c_str());
   _users.require_find(follow.value, (func + "follow user not found").c_str());
   auto following = itr->following;
   for (auto it = following.begin(); it != following.end(); it++)
   {
      if (*it == follow)
      {
         check(false, func + "already following");
      }
   }
   following.push_back(follow);

   uint64_t now_seconds = (uint64_t)current_time_point().sec_since_epoch();
   _users.modify(itr, same_payer, [&](auto &row)
                 {
                  row.following = following;
                  row.date_modified = now_seconds; });
}

ACTION soapboxmain::unfollow(name &alias, name &unfollow)
{
   string func = string(__func__) + string(": ");

   require_auth(alias);

   auto itr = _users.require_find(alias.value, (func + "user not found").c_str());
   auto following = itr->following;
   bool breakFlag = false;
   auto it = following.begin();
   for (it = following.begin(); it != following.end(); it++)
   {
      if (*it == unfollow)
      {
         following.erase(it);
         breakFlag = true;
         break;
      }
   }
   check(breakFlag, func + "not following");

   uint64_t now_seconds = (uint64_t)current_time_point().sec_since_epoch();
   _users.modify(itr, same_payer, [&](auto &row)
                 {
                  row.following = following;
                  row.date_modified = now_seconds; });
}

ACTION soapboxmain::deleteself(name &alias)
{
   string func = string(__func__) + string(": ");

   require_auth(alias);

   auto itr = _users.require_find(alias.value, (func + "user not found").c_str());
   internal_transfer_to_bank(alias, itr->balance.amount);
   _users.erase(itr);
}

ACTION soapboxmain::deleteall(string &confirm)
{
   string func = string(__func__) + string(": ");

   require_auth(get_self());

   check(confirm == "confirm", func + "Please submit the string 'confirm'");

   auto itr = _users.begin();
   while (itr != _users.end())
   {
      itr = _users.erase(itr);
   }
}

ACTION soapboxmain::withdraw(name &alias, asset &quantity)
{
   string func = string(__func__) + string(": ");

   require_auth(alias);

   check(quantity.is_valid(), func + "invalid quantity");
   check(quantity.amount > 0, func + "must withdraw a positive quantity");
   check(quantity.symbol == SYM, func + "invalid symbol");

   auto itr = _users.require_find(alias.value, (func + "user not found").c_str());
   check(itr->balance.amount >= quantity.amount, func + "not enough " + TOKEN_SYMBOL);

   uint64_t now_seconds = (uint64_t)current_time_point().sec_since_epoch();

   _users.modify(itr, same_payer, [&](auto &row)
                 {
         row.balance = asset(itr->balance.amount - quantity.amount, SYM);
         row.date_modified = now_seconds; });

#if TESTNET
   require_recipient(name("soapboxtoken"));
#else
   require_recipient(name("soapboxt.gm"));
#endif
}

void soapboxmain::internal_transfer_to_bank(name &alias, uint64_t amount)
{
   string func = string(__func__) + string(": ");

   if (amount == 0)
   {
      return;
   }
   auto itr = _users.require_find(alias.value, (func + "user not found").c_str());

   // Check balance
   auto balance = itr->balance.amount;
   check(balance >= amount, func + "not enough " + TOKEN_SYMBOL);
   auto new_balance = balance - amount;

   uint64_t now_seconds = (uint64_t)current_time_point().sec_since_epoch();

   // Subtract from user
   _users.modify(itr, same_payer, [&](auto &row)
                 {
         row.balance = asset(new_balance, SYM);
         row.date_modified = now_seconds; });

   // Add to bank
   bank_table the_bank = bank.get();
   the_bank.balance = asset(the_bank.balance.amount + amount, SYM);
   bank.set(the_bank, _self);
}
