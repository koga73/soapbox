#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/singleton.hpp>

#define TESTNET false

using namespace eosio;
using namespace std;

class [[eosio::contract("soapboxmain")]] soapboxmain : public contract
{
public:
	using contract::contract;

	static const string TOKEN_SYMBOL;
	static const int PRECISION;
	static const symbol SYM;

	soapboxmain(name receiver, name code, datastream<const char *> ds) : contract(receiver, code, ds),
																		 _users(receiver, receiver.value),
																		 _bank(receiver, receiver.value)
	{
	}

	ACTION init(asset shout_cost);
	using init_action = action_wrapper<name("init"), &soapboxmain::init>;

#if TESTNET
	[[eosio::on_notify("soapboxtoken::transfer")]] void deposit(name &from, name &to, asset &quantity, string &memo);
#else
	[[eosio::on_notify("soapboxt.gm::transfer")]] void deposit(name &from, name &to, asset &quantity, string &memo);
#endif

	TABLE user_table
	{
		name alias;
		asset balance;
		string shout;
		string tag;
		vector<name> following;
		uint32_t date_created;
		uint32_t date_modified;

		uint64_t primary_key() const { return alias.value; };
		uint64_t by_date_created() const { return date_created; };
		uint64_t by_date_modified() const { return date_modified; };
	};
	typedef multi_index<name("users"), user_table,
						indexed_by<"bycreated"_n, const_mem_fun<user_table, uint64_t, &user_table::by_date_created>>,
						indexed_by<"bymodified"_n, const_mem_fun<user_table, uint64_t, &user_table::by_date_modified>>>
		user_index;
	user_index _users;

	ACTION shout(name &alias, string &shout, string &tag);
	using shout_action = action_wrapper<name("shout"), &soapboxmain::shout>;

	ACTION follow(name &alias, name &follow);
	using follow_action = action_wrapper<name("follow"), &soapboxmain::follow>;

	ACTION unfollow(name &alias, name &unfollow);
	using unfollow_action = action_wrapper<name("unfollow"), &soapboxmain::unfollow>;

	ACTION deleteself(name &alias);
	using deleteself_action = action_wrapper<name("deleteself"), &soapboxmain::deleteself>;

	ACTION deleteall(string &confirm);
	using deleteall_action = action_wrapper<name("deleteall"), &soapboxmain::deleteall>;

	ACTION withdraw(name &alias, asset &quantity);
	using withdraw_action = action_wrapper<name("withdraw"), &soapboxmain::withdraw>;

private:
	TABLE bank_table
	{
		asset balance = asset(0, SYM);
		asset shout_cost;

		uint64_t primary_key() const { return 0; };
	};
	typedef singleton<name("bank"), bank_table> bank_index;
	typedef multi_index<name("bank"), bank_table> bank_index_for_abi;
	bank_index bank = bank_index(get_self(), get_self().value);
	bank_index_for_abi _bank;

	void internal_transfer_to_bank(name &alias, uint64_t amount);
};
