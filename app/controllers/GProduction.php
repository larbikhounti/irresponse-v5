<?php declare(strict_types=1); namespace IR\App\Controllers; if (!defined('IR_START')) exit('<pre>No direct script access allowed</pre>');
/**
 * @framework       iResponse Framework 
 * @version         1.0
 * @author          Amine Idrissi <contact@iresponse.tech>
 * @date            2019
 * @name            Production.php	
 */

# core 
use IR\Core\Application as Application;

# mvc 
use IR\Mvc\Controller as Controller;

# models
use IR\App\Models\Admin\MtaServer as MtaServer;
use IR\App\Models\Admin\ServerVmta as ServerVmta;
use IR\App\Models\Admin\SmtpServer as SmtpServer;
use IR\App\Models\Admin\SmtpUser as SmtpUser;
use IR\App\Models\Admin\GmailServers as GmailServers;
use IR\App\Models\Admin\ManagementServer as ManagementServer;
use IR\App\Models\Affiliate\AffiliateNetwork as AffiliateNetwork;
use IR\App\Models\Affiliate\Offer as Offer;
use IR\App\Models\Affiliate\FromName as FromName;
use IR\App\Models\Affiliate\Subject as Subject;
use IR\App\Models\Production\Header as Header;
use IR\App\Models\Admin\Isp as Isp;
use IR\App\Models\Lists\DataProvider as DataProvider;
use IR\App\Models\Affiliate\Vertical as Vertical;
use IR\App\Models\Production\MtaProcess as MtaProcess;
use IR\App\Models\Production\SmtpProcess as SmtpProcess;
use IR\App\Models\Production\AutoResponder as AutoResponder;
use IR\App\Models\Production\Team as Team;

use IR\App\Models\Admin\ServerProvider as ServerProvider;
use IR\App\Models\Production\TeamAuthorisation as TeamAuthorisation;
use IR\App\Models\Admin\User as User;
use IR\App\Models\Lists\DataList as DataList;

# helpers 
use IR\App\Helpers\Api as Api;
use IR\App\Helpers\Page as Page;
use IR\App\Helpers\DataTable as DataTable;
use IR\App\Helpers\Permissions as Permissions;
use IR\App\Helpers\Authentication as Authentication;

# http 
use IR\Http\Request as Request;

# exceptions
use IR\Exceptions\Types\PageException as PageException;

/**
 * @name Production
 * @description Production Controller
 */
class GProduction extends Controller
{
    /**
     * @app
     * @readwrite
     */
    protected $app;
    
    /**
     * @app
     * @readwrite
     */
    protected $authenticatedUser;

    /**
     * @name init
     * @description initializing process before the action method executed
     * @once
     * @protected
     */
  
    public function init() 
    {
        # set the current application to a local variable
        $this->app = Application::getCurrent();
        
        # connect to the database 
        $this->app->database('system')->connect();
        
        # check for authentication
        if(!Authentication::isUserAuthenticated())
        {
            Page::redirect($this->app->http->request->getBaseURL() . RDS . 'auth' . RDS . 'login.' . DEFAULT_EXTENSION);
        }

        # check users roles 
        Authentication::checkUserRoles();
        
        # get the authenticated user
        $this->authenticatedUser = Authentication::getAuthenticatedUser();
    }

     /**
     * @name get
     * @description the get action
     * @before init
     * @after closeConnections
     */
    public function get() 
    { 
        $columnsArray = [
            'id',
            'server_name',
            'provider_name',
            'status',
            'client_id',
            'client_secret',
            'username',
            'password',
            'expiration_date'
        ];
        
        # get post data
        $data = $this->app->http->request->retrieve(Request::ALL,Request::POST);

        if(count($data))
        {
            # preparing the columns array to create the list
            $columns = [
                's.id' => 'id',
                's.server_name' => 'server_name',
                'p.name' => 'provider_name',
                's.status' => 'status',
                's.client_id' => 'client_id',
                's.client_secret' => 'client_secret',
                's.username' => 'username',
                's.password' => 'password',
                "s.created_date" => 'created_date'
            ];
        
            # fetching the results to create the ajax list
            $query = $this->app->database('system')->query()->from('admin.gmail_servers s',$columns)->join('admin.servers_providers p','s.provider_id = p.id');
            
            die(json_encode(DataTable::init($data,'admin.gmail_servers s',$columns,new GmailServers(),'gmail-servers','DESC',$query)));
        }
    }
    
     /**
     * @name main
     * @description the main action
     * @before init
     * @after closeConnections,checkForMessage
     */
    public function main() 
    { 
        // # check for permissions
        // $access = Permissions::checkForAuthorization($this->authenticatedUser,__CLASS__,__FUNCTION__);

        // if($access == false)
        // {
        //     throw new PageException('Access Denied !',403);
        // }
        
        # preparing the columns array to create the list
        $columnsArray = [
            'id',
            'server_name',
            'provider_name',
            'status',
            'client_id',
            'client_secret',
            'username',
            'password',
            'expiration_date'
        ];
        
        # creating the html part of the list 
        $columns = Page::createTableHeader($columnsArray);
        $filters = Page::createTableFilters($columnsArray);

        // echo "<pre>";
        // die(print_r($columns));
        // echo "</pre>";
        # set menu status
        $this->masterView->set([
           // 'servers_management' => 'true',
            'gmail_servers' => 'true',
            'gmail_servers_show' => 'true'
        ]);
        
        # set data to the page view
        $this->pageView->set([
            'columns' => $columns,
            'filters' => $filters
        ]);
    }

    public function GmailSendProcess() 
    { 
        
        $this->init();
       

        # check for permissions 
        $access = Permissions::checkForAuthorization($this->authenticatedUser,__CLASS__,__FUNCTION__);

        if($access == false)
        {
            throw new PageException('Access Denied !',403);
        } 

       
        
        $arguments = func_get_args(); 
        $processType = isset($arguments) && count($arguments) > 0 ? $arguments[0] : null;
        $processId = isset($arguments) && count($arguments) > 1 ? $arguments[1] : null;

      

        # set data to the page view
        $this->pageView->set([
          "name" => "send place",
        ]); 

        
       
        $this->closeConnections();
    }

    public function AddServer(){
        $this->main();
        $this->init(); // start connection

        # check for permissions 
        $access = Permissions::checkForAuthorization($this->authenticatedUser,__CLASS__,__FUNCTION__);
        if($access == false)
        {
            throw new PageException('Access Denied !',403);
        } 

        $serverProviders = ServerProvider::all();
        $gmailServers = GmailServers::all();
    
        # preparing the columns array to create the list
        $columnsArray = [
            'id',
            'server_name',
            'provider_name',
            'status',
            'client_id',
            'client_secret',
            'username',
            'password',
            'created_date'
        ];
        
        # creating the html part of the list 
        $columns = Page::createTableHeader($columnsArray);
        $filters = Page::createTableFilters($columnsArray);
            
         # set data to the page view
         $this->pageView->set([
            "name" => "gmail server",
            "serverProviders" => $serverProviders,
            "gmailServers" => $gmailServers,
            'columns' => $columns,
            'filters' => $filters
            
          ]);

        $this->closeConnections(); // close connection
    }


    public function AddInbox(){
        $this->init(); // start connection

        # check for permissions 
        $access = Permissions::checkForAuthorization($this->authenticatedUser,__CLASS__,__FUNCTION__);
        if($access == false)
        {
            throw new PageException('Access Denied !',403);
        } 

         # set data to the page view
         $this->pageView->set([
            "name" => "add server"
          ]);

        $this->closeConnections(); // close connection
    }
    // add new server
      /**
     * @name save
     * @description the save action
     * @before init
     * @after closeConnections
     */
    public function save() 
    { 
       
        # get post data
        $data = $this->app->http->request->retrieve(Request::ALL,Request::POST);

        $message = 'Internal server error !';
        $flag = 'error';

        if(count($data))
        {  
            $update = false;
            $server = new GmailServers();

            # update case
            if($this->app->utils->arrays->get($data,'id') > 0)
            {
                # check for permissions
                $access = Permissions::checkForAuthorization($this->authenticatedUser,__CLASS__,'edit');

                if($access == false)
                {
                    throw new PageException('Access Denied !',403);
                }
        
                $update = true;
                $message = 'Record updated succesfully !';
                $server->setId(intval($this->app->utils->arrays->get($data,'id')));
                $server->load();
                $server->setLastUpdatedDate(date('Y-m-d'));
            }
            else
            {
                # check for permissions
                $access = Permissions::checkForAuthorization($this->authenticatedUser,__CLASS__,'add');

                if($access == false)
                {
                    throw new PageException('Access Denied !',403);
                }
        
                $message = 'Record stored succesfully !';
                $server->setCreatedDate(date('Y-m-d'));
                $server->setLastUpdatedDate(date('Y-m-d'));
            }

            $provider = ServerProvider::first(ServerProvider::FETCH_ARRAY,['id = ?',intval($this->app->utils->arrays->get($data,'server-provider'))]);
            $result = -1;
            
            if(count($provider) == 0)
            {
                $message = 'Provider not found !';
            }
            else
            {
               // die($this->app->utils->arrays->get($data,'password'));
                $server->setServerName($this->app->utils->arrays->get($data,'server-name'));
                $server->setStatus($this->app->utils->arrays->get($data,'server-status','Activated'));
                $server->setProviderId(intval($this->app->utils->arrays->get($provider,'id')));
                $server->setProviderName($this->app->utils->arrays->get($provider,'name'));
                $server->setClientId($this->app->utils->arrays->get($data,'client-id'));
                $server->setClientSecret($this->app->utils->arrays->get($data,'client-secret'));
                $server->setUsername($this->app->utils->arrays->get($data,'username'));
                $server->setPassword($this->app->utils->arrays->get($data,'password'));
                $result = $update == false ? $server->insert() : $server->update(); 
                    
                if($result > -1)
                {
                    $flag = 'success';
                }
            }
        }

        # stores the message in the session 
        Page::registerMessage($flag, $message);

        # redirect to lists page
        Page::redirect();
    }
    public function closeConnections() 
    {
        # diconnect from the database 
        $this->app->database('system')->disconnect();
        $this->app->database('clients')->disconnect();
    }


 
}